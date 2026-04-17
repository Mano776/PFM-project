import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) 
  : null;

if (!admin.apps.length) {
  const databaseURL = process.env.VITE_FIREBASE_DATABASE_URL || process.env.FIREBASE_DATABASE_URL;
  if (serviceAccount) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL
      });
    } catch (error: any) {
      console.error("Failed to initialize Firebase Admin with service account:", error.message);
    }
  } else {
    console.warn("FIREBASE_SERVICE_ACCOUNT not found in environment variables.");
    // If we have a project ID, we can try to initialize without credentials (useful for emulators or ADC)
    const projectId = process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
    if (projectId || process.env.FIRESTORE_EMULATOR_HOST) {
      admin.initializeApp({ 
        projectId: projectId || 'pfm-project',
        databaseURL
      });
    }
  }
}

const getFirebaseService = (name: string, fn: () => any) => {
  if (admin.apps.length) {
    try {
      return fn();
    } catch (error) {
      console.error(`Error accessing Firebase ${name}:`, error);
    }
  }
  
  return new Proxy({}, {
    get: (_, prop) => {
      if (prop === 'then') return undefined; // Handle async/await checks
      throw new Error(`Firebase ${name} is not initialized. Please ensure FIREBASE_SERVICE_ACCOUNT is set in your .env file.`);
    }
  });
};

export const db = getFirebaseService('Firestore', () => admin.firestore());
export const auth = getFirebaseService('Auth', () => admin.auth());
export const rtdb = getFirebaseService('Database', () => admin.database());
