import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';

// Check if service account key exists
if (!existsSync('./serviceAccountKey.json')) {
  console.error('❌ serviceAccountKey.json not found!');
  console.log('To set up authentication:');
  console.log('1. Go to Firebase Console > Project Settings > Service Accounts');
  console.log('2. Generate a new private key');
  console.log('3. Download the JSON file and rename it to serviceAccountKey.json');
  console.log('4. Place it in the project root directory');
  console.log('5. Run: node setup_auth.js');
  process.exit(1);
}

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json', 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'bay-services-dashboard'
});

const auth = admin.auth();
const db = admin.firestore();

// Function to create a test user with manager role
async function createTestUser() {
  try {
    const email = 'manager@test.com';
    const password = 'testpassword123';

    // Create user
    const userRecord = await auth.createUser({
      email: email,
      password: password,
      displayName: 'Test Manager'
    });

    console.log('User created:', userRecord.uid);

    // Set custom claims for manager role
    await auth.setCustomUserClaims(userRecord.uid, { role: 'manager' });

    console.log('Custom claims set for manager role');

    // Also create an operator user
    const operatorEmail = 'operator@test.com';
    const operatorRecord = await auth.createUser({
      email: operatorEmail,
      password: password,
      displayName: 'Test Operator'
    });

    await auth.setCustomUserClaims(operatorRecord.uid, { role: 'operator' });

    console.log('Test users created successfully');
    console.log('Manager email:', email);
    console.log('Operator email:', operatorEmail);
    console.log('Password:', password);

  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      console.log('Test users already exist');
    } else {
      console.error('Error creating test users:', error);
    }
  }
}

// Function to list users
async function listUsers() {
  try {
    const listUsersResult = await auth.listUsers(10);
    console.log('Users:');
    listUsersResult.users.forEach((userRecord) => {
      console.log('User:', userRecord.toJSON());
    });
  } catch (error) {
    console.error('Error listing users:', error);
  }
}

// Run setup
async function main() {
  console.log('Setting up Firebase Authentication...');
  await createTestUser();
  await listUsers();
  console.log('Setup complete!');
}

main().catch(console.error);