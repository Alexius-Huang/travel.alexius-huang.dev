#!/usr/bin/env node

import inquirer from 'inquirer';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { writeFile } from 'fs/promises';

dotenv.config();

const isDryRun = process.argv.includes('--dry-run') || process.argv.includes('-d');

console.log('\n🗺️ Generating Route GeoJSON\n');

async function generateRoute() {
    const { startCoord, endCoord } = await inquirer.prompt([
        {
            type: 'input',
            name: 'startCoord',
            message: 'Please enter the starting coordinates (longitude,latitude, e.g., 8.681495,49.41461):',
            validate: (input) => {
                const parts = input.split(',');
                if (parts.length !== 2) {
                    return 'Please enter two values separated by a comma (longitude,latitude).';
                }
                if (isNaN(Number(parts[0])) || isNaN(Number(parts[1]))) {
                    return 'Both values must be valid numbers.';
                }
                return true;
            }
        },
        {
            type: 'input',
            name: 'endCoord',
            message: 'Please enter the ending coordinates (longitude,latitude, e.g., 8.687872,49.420318):',
            validate: (input) => {
                const parts = input.split(',');
                if (parts.length !== 2) {
                    return 'Please enter two values separated by a comma (longitude,latitude).';
                }
                if (isNaN(Number(parts[0])) || isNaN(Number(parts[1]))) {
                    return 'Both values must be valid numbers.';
                }
                return true;
            }
        }
    ]);

    const OPENROUTESERVICE_API_KEY = process.env.OPENROUTESERVICE_API_KEY;

    if (!OPENROUTESERVICE_API_KEY) {
        console.error('\n❌ OPENROUTESERVICE_API_KEY not set in environment variables. Please check your .env file.\n');
        process.exit(1);
    }

    const apiUrl = 'https://api.openrouteservice.org/v2/directions/driving-car/geojson';
    const requestBody = {
        coordinates: [
            startCoord.split(',').map(Number),
            endCoord.split(',').map(Number)
        ]
    };

    console.log(`\n⚡ API Call: ${apiUrl}`);
    console.log(`⚡ Request Body: ${JSON.stringify(requestBody)}\n`);

    if (isDryRun) {
        console.log('\n📢 Dry run: Skipping OpenRouteService API call and file creation.\n');
    } else {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, application/geo+json, application/gpx+xml, application/zipped-shp',
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': OPENROUTESERVICE_API_KEY
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API request failed with status ${response.status}: ${errorText}`);
            }

            const geojson = await response.json();

            const { coordinates } = geojson.features[0].geometry;

            const outputFileName = 'output.json';
            await writeFile(outputFileName, JSON.stringify(coordinates));
            console.log(`\n🎉 Route Coordinates from Response Saved to ${outputFileName} Successfully!\n`);
        } catch (error) {
            console.error('\nAn error occurred during API call or file writing:', error.message);
        }
    }
}

generateRoute();