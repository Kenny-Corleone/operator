import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, getDocs } from 'firebase/firestore';
import firebaseConfig from './firebase.config.js';

/**
 * Firebase Connection Test Utility
 * 
 * This utility provides functions to test Firebase connection
 * and verify that the configuration is working properly.
 */

// Initialize Firebase for testing
let app;
let db;

try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log('✅ Firebase initialized successfully');
} catch (error) {
    console.error('❌ Firebase initialization failed:', error.message);
    throw error;
}

/**
 * Test basic Firebase connection
 */
export async function testFirebaseConnection() {
    try {
        // Test by accessing a non-existent document
        const testDoc = doc(db, 'testConnection', 'test');
        const docSnapshot = await getDoc(testDoc);
        
        console.log('✅ Firebase connection test passed');
        return true;
    } catch (error) {
        console.error('❌ Firebase connection test failed:', error.message);
        return false;
    }
}

/**
 * Test specific collections
 */
export async function testCollections() {
    const collections = [
        'autoAnswers',
        'servicesPrices', 
        'serviceInfo',
        'propertyManagement',
        'outstandingPayments',
        'dispatchingSchedule',
        'managementSchedule'
    ];
    
    const results = {};
    
    for (const collectionName of collections) {
        try {
            const collectionRef = collection(db, collectionName);
            const snapshot = await getDocs(collectionRef);
            results[collectionName] = {
                exists: true,
                documentCount: snapshot.size,
                accessible: true
            };
            console.log(`✅ Collection '${collectionName}' is accessible (${snapshot.size} documents)`);
        } catch (error) {
            results[collectionName] = {
                exists: false,
                documentCount: 0,
                accessible: false,
                error: error.message
            };
            console.warn(`⚠️ Collection '${collectionName}' test failed:`, error.message);
        }
    }
    
    return results;
}

/**
 * Run all tests
 */
export async function runFirebaseTests() {
    console.log('🚀 Starting Firebase tests...');
    
    const connectionTest = await testFirebaseConnection();
    const collectionsTest = await testCollections();
    
    const allTestsPassed = connectionTest && Object.values(collectionsTest).every(col => col.accessible);
    
    console.log('\n📊 Test Results Summary:');
    console.log(`Connection Test: ${connectionTest ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`Collections Test: ${allTestsPassed ? '✅ PASSED' : '❌ FAILED'}`);
    
    if (!allTestsPassed) {
        console.log('\n🔧 Troubleshooting tips:');
        console.log('1. Check your Firebase configuration in .env.local');
        console.log('2. Verify Firebase project is enabled in Firebase Console');
        console.log('3. Ensure Firestore database is created');
        console.log('4. Check network connectivity');
    }
    
    return {
        connectionTest,
        collectionsTest,
        allTestsPassed
    };
}

// Export Firebase instances for testing
export { app, db };