# Firebase Setup Guide for The Bay Services Dashboard

## Overview
This guide provides instructions for setting up Firebase in the React/Vite dashboard project for "The Bay Services".

## Prerequisites
1. Firebase project created at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Project enabled with Firestore Database and Authentication

## Configuration Steps

### 1. Environment Variables Setup
1. Copy `.env.example` to `.env.local`
2. Fill in your Firebase project credentials:
   ```bash
   cp .env.example .env.local
   ```

3. Get your Firebase credentials from the Firebase Console:
   - Go to Project Settings
   - Under "Your apps", click the web app icon (</>)
   - Register your app (if not already registered)
   - Copy the configuration object

### 2. Firebase Configuration
The Firebase configuration is set up in `src/utils/firebase.config.js` with environment variable support.

### 3. Required Firebase Services
Ensure these services are enabled in your Firebase project:

#### Firestore Database
1. In Firebase Console, go to Firestore Database
2. Create a database in "test mode" initially
3. Set up security rules (see `firestore.rules`)

#### Authentication
1. In Firebase Console, go to Authentication
2. Enable Email/Password provider
3. Optionally enable other providers as needed

### 4. Collections Structure
The following collections should be created in Firestore:

```
autoAnswers
servicesPrices
serviceInfo
propertyManagement
outstandingPayments
dispatchingSchedule
managementSchedule
```

## Authentication Setup

### 1. Enable Authentication in Firebase Console
1. Go to Firebase Console > Authentication
2. Enable Email/Password provider
3. (Optional) Enable other providers as needed

### 2. Set up Service Account for Admin Operations
1. Go to Firebase Console > Project Settings > Service Accounts
2. Generate a new private key
3. Download the JSON file and rename it to `serviceAccountKey.json`
4. Place it in the project root directory

### 3. Create Test Users
```bash
npm run setup-auth
```
This will create test users with manager and operator roles.

### 4. Configure Environment Variables
Update `.env.local` with your Firebase credentials:
```bash
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
# ... other variables
```

## Testing the Setup

### 1. Development Testing
```bash
npm run dev
```

### 2. Production Testing
```bash
npm run build
npm run preview
```

### 3. Firebase Connection Test
```bash
node firebase.test.js
```

### 4. Authenticated Upload Test
```bash
npm run upload-firebase
```

Check browser console for:
- Firebase initialization messages
- Any configuration warnings
- Successful data loading

## Common Issues and Solutions

### 1. Firebase API Key Not Configured
**Error**: "Firebase API key is not configured"
**Solution**: Set `VITE_FIREBASE_API_KEY` in `.env.local`

### 2. Permission Denied
**Error**: "Missing or insufficient permissions"
**Solution**: Update Firestore security rules in `firestore.rules`

### 3. Network Issues
**Error**: "Network request failed"
**Solution**: Check internet connection and Firebase project status

## Security Considerations

1. **Environment Variables**: Never commit `.env.local` to version control
2. **Firestore Rules**: Implement proper security rules for production
3. **Authentication**: Use proper authentication in production
4. **Data Validation**: Validate data on both client and server sides

## Production Deployment

1. Update environment variables with production Firebase credentials
2. Set up proper Firestore security rules
3. Configure Firebase Authentication
4. Test all functionality in production environment

## Support

For Firebase-related issues:
1. Check Firebase Console for errors
2. Review browser console for error messages
3. Verify network connectivity
4. Ensure all required services are enabled