#!/usr/bin/env node

import inquirer from 'inquirer';
import { execa } from 'execa';
import { existsSync, createReadStream } from 'fs';
import { unlink } from 'fs/promises';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const isDryRun = process.argv.includes('--dry-run') || process.argv.includes('-d');

console.log('\n⚡ Generating PMTiles Map\n');

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
    }
]);

const { maxZoom } = await inquirer.prompt([{
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
}]);

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');
const dateString = `${year}${month}${day}`;

const pmtilesUrl = `https://build.protomaps.com/${dateString}.pmtiles`;
const outputFile = `${pmtilesName}.pmtiles`;

const args = ['extract', pmtilesUrl, outputFile, `--bbox=${boundingBox}`];

if (minZoom) {
    args.push(`--minzoom=${minZoom}`);
}

if (maxZoom) {
    args.push(`--maxzoom=${maxZoom}`);
}

console.log(`\n⚡ Run: pmtiles ${args.join(' ')}\n`);

if (isDryRun) {
    console.log('\n📢 This is a dry run. No files will be created or uploaded \n');
} else {
    try {
        await execa('pmtiles', args, { stdio: 'inherit' });
        console.log(`\n📢 File ${outputFile} created successfully.`);

        if (!existsSync(outputFile)) {
            throw new Error(`${outputFile} was not created.`);
        }

        console.log('\n🚀 Uploading to Cloudflare R2...');

        const { CLOUDFLARE_ACCOUNT_ID, R2_BUCKET_NAME, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, UPLOAD_DIR } = process.env;

        if (!CLOUDFLARE_ACCOUNT_ID || !R2_BUCKET_NAME || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
            throw new Error('Cloudflare R2 credentials not set in environment variables.');
        }

        const s3 = new S3Client({
            region: 'auto',
            endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: AWS_ACCESS_KEY_ID,
                secretAccessKey: AWS_SECRET_ACCESS_KEY,
            },
        });

        const fileStream = createReadStream(outputFile);

        const uploadFileLocation = `${UPLOAD_DIR}/${outputFile}`;

        await s3.send(new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: uploadFileLocation,
            Body: fileStream,
        }));

        console.log(`\n🎉 ${uploadFileLocation} uploaded to R2 successfully!\n`);

        try {
            await unlink(outputFile);
            console.log(`\n🗑️ ${outputFile} deleted successfully.`);
        } catch (unlinkError) {
            console.error(`\n⚠️ Error deleting ${outputFile}:`, unlinkError.message);
        }

    } catch (error) {
        console.error('\nAn error occurred:', error.message);
    } finally {
        console.log('\n⚡ Cleaning up...');

        if (existsSync(outputFile)) {
            console.log(`\n⚡ Removing ${outputFile}...`);
            await unlink(outputFile);
        }        
        console.log(`\n🎉 Clean up complete!\n`);
    }
}
