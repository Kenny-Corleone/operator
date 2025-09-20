import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where, limit, orderBy } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import firebaseConfig from './firebase.config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Error logging utility
function logFirebaseError(operation, error) {
    console.error(`Firebase ${operation} error:`, error);
    if (error.code) {
        console.error(`Error code: ${error.code}`);
        console.error(`Error message: ${error.message}`);
    }
    return error;
}

// Validate Firebase initialization
if (!app) {
    console.error('Firebase app failed to initialize. Check your configuration.');
}

// Collection names
const COLLECTIONS = {
    AUTO_ANSWERS: 'autoAnswers',
    SERVICES_PRICES: 'servicesPrices',
    SERVICE_INFO: 'serviceInfo',
    PROPERTY_MANAGEMENT: 'propertyManagement',
    OUTSTANDING_PAYMENTS: 'outstandingPayments',
    DISPATCHING_SCHEDULE: 'dispatchingSchedule',
    MANAGEMENT_SCHEDULE: 'managementSchedule'
};

// Generic functions for CRUD operations
export async function getData(collectionName, options = {}) {
    try {
        const { queries = [], orderByField, limitCount } = options;
        let collectionRef = collection(db, collectionName);
        
        // Apply queries
        if (queries.length > 0) {
            collectionRef = query(collectionRef, ...queries);
        }
        
        // Apply ordering
        if (orderByField) {
            collectionRef = query(collectionRef, orderBy(orderByField));
        }
        
        // Apply limit
        if (limitCount) {
            collectionRef = query(collectionRef, limit(limitCount));
        }
        
        const snapshot = await getDocs(collectionRef);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        logFirebaseError(`getData for ${collectionName}`, error);
        throw error;
    }
}

export async function addData(collectionName, data) {
    try {
        const docRef = await addDoc(collection(db, collectionName), data);
        console.log(`Document added successfully to ${collectionName} with ID: ${docRef.id}`);
        return { id: docRef.id, ...data };
    } catch (error) {
        logFirebaseError(`addData to ${collectionName}`, error);
        throw error;
    }
}

export async function updateData(collectionName, id, data) {
    try {
        const docRef = doc(db, collectionName, id);
        await updateDoc(docRef, data);
        console.log(`Document updated successfully in ${collectionName} with ID: ${id}`);
        return { id, ...data };
    } catch (error) {
        logFirebaseError(`updateData in ${collectionName}`, error);
        throw error;
    }
}

export async function deleteData(collectionName, id) {
    try {
        const docRef = doc(db, collectionName, id);
        await deleteDoc(docRef);
        console.log(`Document deleted successfully from ${collectionName} with ID: ${id}`);
        return id;
    } catch (error) {
        logFirebaseError(`deleteData from ${collectionName}`, error);
        throw error;
    }
}

// Specific functions for each collection
export async function getAutoAnswers() {
    return getData(COLLECTIONS.AUTO_ANSWERS);
}

export async function getServicesPrices() {
    return getData(COLLECTIONS.SERVICES_PRICES);
}

export async function getServiceInfo() {
    return getData(COLLECTIONS.SERVICE_INFO);
}

export async function getPropertyManagement() {
    return getData(COLLECTIONS.PROPERTY_MANAGEMENT);
}

export async function getOutstandingPayments() {
    return getData(COLLECTIONS.OUTSTANDING_PAYMENTS);
}

export async function getSchedules() {
    const dispatching = await getData(COLLECTIONS.DISPATCHING_SCHEDULE);
    const management = await getData(COLLECTIONS.MANAGEMENT_SCHEDULE);
    return { dispatching, management };
}

// Real-time listeners with error handling
export function subscribeToSchedules(callback) {
    try {
        const dispatchingUnsubscribe = onSnapshot(
            collection(db, COLLECTIONS.DISPATCHING_SCHEDULE),
            (snapshot) => {
                const dispatching = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                callback({ dispatching });
            },
            (error) => {
                logFirebaseError('subscribeToSchedules - dispatching', error);
            }
        );

        const managementUnsubscribe = onSnapshot(
            collection(db, COLLECTIONS.MANAGEMENT_SCHEDULE),
            (snapshot) => {
                const management = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                callback({ management });
            },
            (error) => {
                logFirebaseError('subscribeToSchedules - management', error);
            }
        );

        // Return combined unsubscribe function
        return () => {
            dispatchingUnsubscribe();
            managementUnsubscribe();
        };
    } catch (error) {
        logFirebaseError('subscribeToSchedules setup', error);
        throw error;
    }
}

export function subscribeToOutstandingPayments(callback) {
    try {
        return onSnapshot(
            collection(db, COLLECTIONS.OUTSTANDING_PAYMENTS),
            (snapshot) => {
                const payments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                callback(payments);
            },
            (error) => {
                logFirebaseError('subscribeToOutstandingPayments', error);
            }
        );
    } catch (error) {
        logFirebaseError('subscribeToOutstandingPayments setup', error);
        throw error;
    }
}

// Firebase Authentication functions
export async function createUser(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('User created successfully:', userCredential.user.uid);
        return userCredential.user;
    } catch (error) {
        logFirebaseError('createUser', error);
        throw error;
    }
}

export async function signInUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('User signed in successfully:', userCredential.user.uid);
        return userCredential.user;
    } catch (error) {
        logFirebaseError('signInUser', error);
        throw error;
    }
}

export async function signOutUser() {
    try {
        await signOut(auth);
        console.log('User signed out successfully');
    } catch (error) {
        logFirebaseError('signOutUser', error);
        throw error;
    }
}

// Note: onAuthStateChanged is imported from firebase/auth above
// This is a wrapper function
export function onAuthStateChange(callback) {
    return onAuthStateChanged(auth, callback, (error) => {
        logFirebaseError('onAuthStateChanged', error);
    });
}

// Enhanced query functions
export async function getDataWithQuery(collectionName, queries, options = {}) {
    try {
        const { orderByField, limitCount } = options;
        let collectionRef = query(collection(db, collectionName), ...queries);
        
        if (orderByField) {
            collectionRef = query(collectionRef, orderBy(orderByField));
        }
        
        if (limitCount) {
            collectionRef = query(collectionRef, limit(limitCount));
        }
        
        const snapshot = await getDocs(collectionRef);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        logFirebaseError(`getDataWithQuery for ${collectionName}`, error);
        throw error;
    }
}

// Export collections constant and auth
export { COLLECTIONS, auth };

// Export Firebase Auth functions
export { onAuthStateChanged };