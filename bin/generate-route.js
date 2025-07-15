#!/usr/bin/env node

import inquirer from 'inquirer';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { writeFile } from 'fs/promises';
import { execa } from 'execa';

dotenv.config();

const isDryRun =
    process.argv.includes('--dry-run') || process.argv.includes('-d');

console.log('\n⚡ Generating Route GeoJSON\n');

const { routeFileName, coordinatesInput } = await inquirer.prompt([
    {
        type: 'input',
        name: 'routeFileName',
        message:
            'Please provide a name for the route GeoJSON file (e.g., `my-route`):',
        default: 'output',
        validate: (input) => {
            if (input.trim() === '') {
                return 'Please provide a valid file name.';
            }
            if (!/^[a-zA-Z0-9_.-]+$/.test(input)) {
                return 'The file name can only include alphanumeral characters, underscores, dashes, and dots.';
            }
            return true;
        },
    },
    {
        type: 'input',
        name: 'coordinatesInput',
        message:
            'Please enter multiple coordinates (longitude,latitude; separated by semicolons, e.g., 8.681495,49.41461;8.687872,49.420318;8.690000,49.430000):',
        validate: (input) => {
            const pairs = input.split(';');
            if (pairs.length < 2) {
                return 'Please enter at least two coordinate pairs separated by semicolons.';
            }
            for (const pair of pairs) {
                const parts = pair.split(',');
                if (
                    parts.length !== 2 ||
                    isNaN(Number(parts[0])) ||
                    isNaN(Number(parts[1]))
                ) {
                    return `Invalid coordinate format: ${pair}. Each pair must be longitude,latitude.`;
                }
            }
            return true;
        },
    },
]);

const OPENROUTESERVICE_API_KEY = process.env.OPENROUTESERVICE_API_KEY;

if (!OPENROUTESERVICE_API_KEY) {
    console.error(
        '\n❌ OPENROUTESERVICE_API_KEY not set in environment variables. Please check your .env file.\n',
    );
    process.exit(1);
}

const coordinates = coordinatesInput
    .split(';')
    .map((pair) => pair.split(',').map(Number));
const allRouteCoordinates = [];

for (let i = 0; i < coordinates.length - 1; i++) {
    const startCoord = coordinates[i];
    const endCoord = coordinates[i + 1];

    const apiUrl =
        'https://api.openrouteservice.org/v2/directions/driving-car/geojson';
    const requestBody = {
        coordinates: [startCoord, endCoord],
        geometry_simplify: true
    };

    console.log(`\n⚡ API Call for segment ${i + 1}: ${apiUrl}`);
    console.log(`⚡ Request Body: ${JSON.stringify(requestBody)}`);

    if (isDryRun) {
        console.log('\n📢 Dry run: Skipping OpenRouteService API call.\n');
        console.log(
            `📢 Segment ${i + 1} coordinates:`,
            requestBody.coordinates,
        );
        continue;
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                Accept: 'application/json, application/geo+json, application/gpx+xml, application/zipped-shp',
                'Content-Type': 'application/json; charset=utf-8',
                Authorization: OPENROUTESERVICE_API_KEY,
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                `API request failed for segment ${i + 1} with status ${response.status}: ${errorText}`,
            );
        }

        const geojsonResponse = await response.json();
        const segmentCoordinates =
            geojsonResponse.features[0].geometry.coordinates;
        allRouteCoordinates.push(segmentCoordinates);
    } catch (error) {
        console.error('\nAn error occurred during API call:', error.message);
        process.exit(1);
    }
}

const outputFileName = `${routeFileName}.json`;

if (isDryRun) {
    console.log(
        `\n📢 Dry run: Would save GeoJSON to ${outputFileName} and upload to R2.`,
    );
    process.exit(0);
}

try {
    await writeFile(outputFileName, JSON.stringify(allRouteCoordinates), {
        encoding: 'utf8',
    });
    console.log(
        `\n🎉 Combined Route GeoJSON saved to ${outputFileName} successfully!\n`,
    );

    // Upload to Cloudflare R2 using the new utility
    const uploadS3Args = [
        '--file',
        outputFileName,
        '--upload-dir',
        'routes',
        '--cleanup',
        'true',
    ];

    console.log(`\n⚡ Uploading to Cloudflare R2 using upload-s3 utility...\n`);
    console.log(
        `\n⚡ Run: ${`pnpm run upload-s3 ${uploadS3Args.join(' ')}`} \n`,
    );
    await execa('node', ['./bin/upload-s3.js', ...uploadS3Args], {
        stdio: 'inherit',
    });
} catch (error) {
    console.error(
        '\nAn error occurred during file writing or upload:',
        error.message,
    );
    process.exit(1);
}
