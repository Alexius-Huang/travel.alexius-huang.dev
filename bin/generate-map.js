#!/usr/bin/env node

import inquirer from 'inquirer';
import { execa } from 'execa';
import { existsSync } from 'fs';

const isDryRun = process.argv.includes('--dry-run') || process.argv.includes('-d');

console.log('\n⚡ Gathering Information to Generate PMTiles\n');

const { pmtilesName, boundingBox, minZoom } = await inquirer.prompt([
    {
        type: 'input',
        name: 'pmtilesName',
        message: 'Please provide a name for the `pmtiles` file (e.g., `example` would create `example.pmtiles` file):',
        validate: (input) => {
            if (input.trim() === '') {
                return 'Please provide a valid name.';
            }
            if (!/^[a-zA-Z0-9_-]+$/.test(input)) {
                return 'The name can only include alphanumeral characters, underscores and dashes.';
            }
            return true;
        }
    },
    {
        type: 'input',
        name: 'boundingBox',
        message: 'Please input the bounding box of the map to be extracted (e.g., minLon,minLat,maxLon,maxLat):',
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
        }
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
        }
    },
]);

const { maxZoom } = await inquirer.prompt({
    type: 'input',
    name: 'maxZoom',
    message: 'Please specify the maximum zoom (Leave it empty to skip):',
    validate: (input) => {
        if (input === '') return true;
        const maxZoomNum = Number(input);
        if (isNaN(maxZoomNum) || maxZoomNum <= Number(minZoom) || maxZoomNum > 18) {
            return `Maximum zoom must be a number greater than ${minZoom} and less than or equal to 18.`;
        }
        return true;
    }
});

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');
const dateString = `${year}${month}${day}`;

const pmtilesUrl = `https://build.protomaps.com/${dateString}.pmtiles`;
const outputFile = `${pmtilesName}.pmtiles`;

const args = ['extract', pmtilesUrl, outputFile, `--box=${boundingBox}`];

if (minZoom) {
    args.push(`--minzoom=${minZoom}`);
}

if (maxZoom) {
    args.push(`--maxzoom=${maxZoom}`);
}

console.log(`\n⚡ pmtiles ${args.join(' ')}\n`);

if (!isDryRun) {
    try {
        const { stdout, stderr } = await execa('pmtiles', args);
        console.log(stdout);
        if (stderr) {
            console.error(stderr);
        }

        if (existsSync(outputFile)) {
            console.log(`\nFile ${outputFile} created successfully.`);
        } else {
            console.error(`\nError: ${outputFile} was not created.`);
        }
    } catch (error) {
        console.error('Error executing pmtiles command:', error);
    }
} else {
    console.log('📢 This is a dry run. No files will be created.');
}
