import admin from 'firebase-admin';
import { config } from './config';

// Initialize Firebase Admin with credentials
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: config.firebase.projectId,
      clientEmail: config.firebase.clientEmail,
      privateKey: config.firebase.privateKey.replace(/\\n/g, '\n'),
    }),
    databaseURL: `https://${config.firebase.projectId}.firebaseio.com`,
    storageBucket: process.env.STORAGE_BUCKET || 'devfestcert.firebasestorage.app',
  });
}

export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();