#!/usr/bin/env node

import { readFileSync, unlinkSync, existsSync } from 'fs';
import { basename } from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const args = process.argv.slice(2);

let filePath = '';
let uploadDir = '';
let cleanup = true; // Default to true
let isDryRun = false;

for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--file' || arg === '-f') {
        filePath = args[++i];
    } else if (arg === '--upload-dir') {
        uploadDir = args[++i];
    } else if (arg === '--cleanup') {
        const nextArg = args[i + 1];
        if (nextArg === 'true' || nextArg === 'false') {
            cleanup = nextArg === 'true';
            i++;
        } else {
            cleanup = true; // If --cleanup is present without a value, it's true
        }
    } else if (arg === '--dryRun' || arg === '-d') {
        isDryRun = true;
    } else {
        console.log(`Ignoring unknown argument: ${arg}`);
    }
}

if (!filePath || !uploadDir) {
    console.error('Usage: upload-s3 --file <path-to-file> --upload-dir <r2-directory> [--cleanup <true|false>] [--dryRun|-d]');
    process.exit(1);
}

// Check if the file exists locally
if (!existsSync(filePath)) {
    console.error(`\n❌ Error: Local file not found at ${filePath}`);
    process.exit(1);
}

const { CLOUDFLARE_ACCOUNT_ID, R2_BUCKET_NAME, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;

if (!CLOUDFLARE_ACCOUNT_ID || !R2_BUCKET_NAME || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
    console.error('\n❌ Cloudflare R2 credentials not set in environment variables. Please check your .env file.');
    process.exit(1);
}

const s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
});

try {
    const fileName = basename(filePath);
    const uploadKey = `${uploadDir}/${fileName}`;

    console.log(`\n⚡ Attempting to upload ${filePath} to R2 bucket ${R2_BUCKET_NAME}/${uploadKey}...`);

    if (isDryRun) {
        console.log('\n📢 Dry run: Skipping actual upload.');
    } else {
        const fileContent = readFileSync(filePath);
        await s3.send(new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: uploadKey,
            Body: fileContent,
        }));
        console.log(`\n🎉 Successfully uploaded ${filePath} to ${R2_BUCKET_NAME}/${uploadKey}`);
    }

    if (cleanup) {
        if (isDryRun) {
            console.log(`\n📢 Dry run: Would clean up local file: ${filePath}`);
        } else {
            console.log(`\n⚡ Cleaning up local file: ${filePath}`);
            unlinkSync(filePath);
            console.log(`\n📢 Successfully deleted local file: ${filePath}`);
        }
    } else {
        console.log('\n📢 Cleanup skipped as --cleanup was false.');
    }
} catch (error) {
    console.error(`\n❌ Error during operation: ${error.message}`);
    process.exit(1);
}
