// Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "bay-services-dashboard.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "bay-services-dashboard",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "bay-services-dashboard.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
};

// Validate Firebase configuration
if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "YOUR_API_KEY") {
    console.warn("Firebase API key is not configured. Please set VITE_FIREBASE_API_KEY environment variable.");
}

if (!firebaseConfig.projectId || firebaseConfig.projectId === "bay-services-dashboard") {
    console.warn("Firebase project ID is using default value. Please set VITE_FIREBASE_PROJECT_ID environment variable.");
}

export default firebaseConfig;