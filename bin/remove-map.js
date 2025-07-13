#!/usr/bin/env node

import inquirer from 'inquirer';
import {
    S3Client,
    DeleteObjectCommand,
    HeadObjectCommand,
} from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const isDryRun =
    process.argv.includes('--dry-run') || process.argv.includes('-d');

console.log('\n⚡ Removing PMTiles Map from Cloudflare R2\n');

async function removeMap() {
    const { pmtilesName } = await inquirer.prompt([
        {
            type: 'input',
            name: 'pmtilesName',
            message:
                'Please provide the name of the `pmtiles` file to remove (e.g., `example` for `example.pmtiles`):',
            validate: (input) => {
                if (input.trim() === '') {
                    return 'Please provide a valid name.';
                }
                if (!/^[a-zA-Z0-9_-]+$/.test(input)) {
                    return 'The name can only include alphanumeral characters, underscores and dashes.';
                }
                return true;
            },
        },
    ]);

    const outputFile = `${pmtilesName}.pmtiles`;
    const {
        CLOUDFLARE_ACCOUNT_ID,
        R2_BUCKET_NAME,
        AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY,
        UPLOAD_DIR = 'pmtiles',
    } = process.env;

    if (
        !CLOUDFLARE_ACCOUNT_ID ||
        !R2_BUCKET_NAME ||
        !AWS_ACCESS_KEY_ID ||
        !AWS_SECRET_ACCESS_KEY
    ) {
        console.error(
            '\n❌ Cloudflare R2 credentials not set in environment variables. Please check your .env file.\n',
        );
        return;
    }

    const s3 = new S3Client({
        region: 'auto',
        endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY,
        },
    });

    const uploadFileLocation = `${UPLOAD_DIR}/${outputFile}`;

    try {
        console.log(`\n🔍 Checking for ${uploadFileLocation} in R2...`);
        await s3.send(
            new HeadObjectCommand({
                Bucket: R2_BUCKET_NAME,
                Key: uploadFileLocation,
            }),
        );
        console.log(`✅ File ${uploadFileLocation} found in R2.`);

        const { confirmDelete } = await inquirer.prompt({
            type: 'confirm',
            name: 'confirmDelete',
            message: `Are you sure you want to delete ${uploadFileLocation} from R2?`,
            default: false,
        });

        if (!confirmDelete) {
            console.log('\n❌ Operation cancelled by user.');
            return;
        }

        if (isDryRun) {
            console.log(
                `\n📢 Dry run: Would have deleted ${uploadFileLocation} from R2.`,
            );
        } else {
            console.log(`\n🗑️ Deleting ${uploadFileLocation} from R2...`);
            await s3.send(
                new DeleteObjectCommand({
                    Bucket: R2_BUCKET_NAME,
                    Key: uploadFileLocation,
                }),
            );
            console.log(
                `\n🎉 ${uploadFileLocation} deleted successfully from R2!\n`,
            );
        }
    } catch (error) {
        if (error.name === 'NotFound') {
            console.log(
                `\n❌ File ${uploadFileLocation} does not exist in R2.`,
            );
        } else {
            console.error('\nAn error occurred:', error.message);
        }
    }
}

let continueRemoving = true;
while (continueRemoving) {
    await removeMap();
    const { another } = await inquirer.prompt({
        type: 'confirm',
        name: 'another',
        message: 'Do you want to remove another map?',
        default: false,
    });
    continueRemoving = another;
}

console.log('\n👋 Exiting remove map tool.\n');
