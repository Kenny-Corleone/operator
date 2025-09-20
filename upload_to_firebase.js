import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import admin from 'firebase-admin';
import { promises as fs } from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const serviceAccount = require('./the-bay-services-firebase-adminsdk-fbsvc-9b42bd4a8d.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Function to get document ID based on collection
function getDocumentId(item, collectionName) {
    switch (collectionName) {
        case 'autoAnswers':
            return item['Service type']?.toString().replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        case 'servicesPrices':
            return item['Service']?.toString().replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        case 'serviceInfo':
            return item['SERVICE']?.toString().replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        case 'propertyManagement':
            return item['id']?.toString();
        case 'outstandingPayments':
            return item['id']?.toString();
        case 'dispatchingSchedule':
            return item['Days']?.toString().toLowerCase();
        case 'managementSchedule':
            return item['Days']?.toString().toLowerCase();
        default:
            return null;
    }
}

async function uploadJsonToFirebase(jsonPath, collectionName) {
    try {
        console.log(`Reading data from ${jsonPath}...`);
        const data = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));
        const collectionRef = db.collection(collectionName);

        let successCount = 0;
        let errorCount = 0;

        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            try {
                const docId = getDocumentId(item, collectionName);
                if (!docId) {
                    console.error(`No valid ID found for item ${i + 1} in ${collectionName}`);
                    errorCount++;
                    continue;
                }

                const docRef = collectionRef.doc(docId);
                await docRef.set(item);
                successCount++;
                console.log(`Uploaded item ${i + 1}/${data.length} to ${collectionName} (ID: ${docId})`);
            } catch (itemError) {
                console.error(`Error uploading item ${i + 1} to ${collectionName}:`, itemError.message);
                errorCount++;
            }
        }

        console.log(`✅ Completed upload to ${collectionName}: ${successCount} successful, ${errorCount} errors`);
        return { successCount, errorCount };
    } catch (error) {
        console.error(`❌ Error processing ${jsonPath} for ${collectionName}:`, error.message);
        throw error;
    }
}

async function main() {
    // Define the mapping of JSON files to Firebase collections
    const uploadTasks = [
        { path: 'processed_auto_answers.json', collection: 'autoAnswers' },
        { path: 'processed_services_prices.json', collection: 'servicesPrices' },
        { path: 'processed_service_info.json', collection: 'serviceInfo' },
        { path: 'processed_property_management.json', collection: 'propertyManagement' },
        { path: 'processed_outstanding_payments.json', collection: 'outstandingPayments' },
        { path: 'processed_dispatching_schedule.json', collection: 'dispatchingSchedule' },
        { path: 'processed_management_schedule.json', collection: 'managementSchedule' }
    ];

    console.log('🚀 Starting data upload to Firebase...');
    console.log('=' .repeat(50));

    let totalSuccess = 0;
    let totalErrors = 0;

    for (let i = 0; i < uploadTasks.length; i++) {
        const task = uploadTasks[i];
        console.log(`\n📁 [${i + 1}/${uploadTasks.length}] Processing ${task.path} → ${task.collection}`);
        console.log('-'.repeat(40));

        try {
            const result = await uploadJsonToFirebase(task.path, task.collection);
            totalSuccess += result.successCount;
            totalErrors += result.errorCount;
        } catch (error) {
            console.error(`❌ Failed to process ${task.path}: ${error.message}`);
            totalErrors++;
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 UPLOAD SUMMARY:');
    console.log(`✅ Total successful uploads: ${totalSuccess}`);
    console.log(`❌ Total errors: ${totalErrors}`);

    if (totalErrors === 0) {
        console.log('🎉 All data uploaded successfully!');
        process.exit(0);
    } else {
        console.log('⚠️  Upload completed with some errors. Check logs above.');
        process.exit(1);
    }
}

main().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
});