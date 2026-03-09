import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) 
  : null;

if (serviceAccount && !admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} else if (!admin.apps.length) {
  console.warn("FIREBASE_SERVICE_ACCOUNT not found. Backend Firestore features will be limited.");
}

export const db = admin.firestore();
export const auth = admin.auth();
