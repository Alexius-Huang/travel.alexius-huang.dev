#!/usr/bin/env node

import inquirer from 'inquirer';
import { execa } from 'execa';
import { existsSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const isDryRun =
    process.argv.includes('--dry-run') || process.argv.includes('-d');

console.log('\n⚡ Generating PMTiles Map\n');

const { pmtilesName, boundingBox, minZoom } = await inquirer.prompt([
    {
        type: 'input',
        name: 'pmtilesName',
        message:
            'Please provide a name for the `pmtiles` file (e.g., `example` would create `example.pmtiles` file):',
        validate: (input) => {
            if (input.trim() === '') {
                return 'Please provide a valid name.';
            }
            if (!/^[a-zA-Z0-9\._-]+$/.test(input)) {
                return 'The name can only include alphanumeral characters, underscores and dashes.';
            }
            return true;
        },
    },
    {
        type: 'input',
        name: 'boundingBox',
        message:
            'Please input the bounding box of the map to be extracted (e.g., minLon,minLat,maxLon,maxLat):',
        validate: (input) => {
            const parts = input.split(',');
            if (parts.length !== 4) {
                return 'Please enter four values separated by commas.';
            }
            for (const part of parts) {
                if (isNaN(Number(part))) {
                    return 'All values must be valid numbers.';
                }
            }
            return true;
        },
    },
    {
        type: 'input',
        name: 'minZoom',
        message: 'Please specify the minimum zoom (Leave it empty to skip):',
        validate: (input) => {
            if (input === '') return true;
            const zoom = Number(input);
            if (isNaN(zoom) || zoom < 3 || zoom > 18) {
                return 'Minimum zoom must be a number between 3 and 17.';
            }
            return true;
        },
    },
]);

const { maxZoom } = await inquirer.prompt([
    {
        type: 'input',
        name: 'maxZoom',
        message: 'Please specify the maximum zoom (Leave it empty to skip):',
        validate: (input) => {
            if (input === '') return true;
            const maxZoomNum = Number(input);
            if (
                isNaN(maxZoomNum) ||
                maxZoomNum <= Number(minZoom) ||
                maxZoomNum > 18
            ) {
                return `Maximum zoom must be a number greater than ${minZoom} and less than or equal to 18.`;
            }
            return true;
        },
    },
]);

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');
const dateString = `${year}${month}${day}`;

/**
 *  TODO: If the request failed, it might be due to the archive for the map
 *        is not geneerated on that day
 */
const pmtilesUrl = `https://build.protomaps.com/${dateString}.pmtiles`;
const outputFile = `${pmtilesName}.pmtiles`;

const pmtilesArgs = [
    'extract',
    pmtilesUrl,
    outputFile,
    `--bbox=${boundingBox}`,
];

if (minZoom) {
    pmtilesArgs.push(`--minzoom=${minZoom}`);
}

if (maxZoom) {
    pmtilesArgs.push(`--maxzoom=${maxZoom}`);
}

console.log(`\n⚡ Run: pmtiles ${pmtilesArgs.join(' ')}\n`);

if (isDryRun) {
    console.log(
        '\n📢 This is a dry run. No files will be created or uploaded \n',
    );
} else {
    try {
        // Execute pmtiles command
        await execa('pmtiles', pmtilesArgs, { stdio: 'inherit' });
        console.log(`\n📢 File ${outputFile} created successfully.`);

        if (!existsSync(outputFile)) {
            throw new Error(`${outputFile} was not created.`);
        }

        // Upload to Cloudflare R2 using the new utility
        const uploadS3Args = [
            '-f',
            outputFile,
            '--upload-dir',
            process.env.UPLOAD_DIR || 'pmtiles',
            '--cleanup',
            'true',
        ];

        console.log(
            `\n🚀 Uploading to Cloudflare R2 using upload-s3 utility...\n`,
        );
        console.log(
            `\n🚀 ⚡ Run: ${`pnpm run upload-s3 ${uploadS3Args.join(' ')}`} \n`,
        );
        await execa('pnpm', ['run', 'upload-s3', ...uploadS3Args], {
            stdio: 'inherit',
        });
    } catch (error) {
        console.error('\nAn error occurred:', error.message);
    }
}
