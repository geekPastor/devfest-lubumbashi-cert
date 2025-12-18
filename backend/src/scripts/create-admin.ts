import * as admin from 'firebase-admin';
import { config } from '../config';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

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

const auth = admin.auth();

const createAdmin = async (email: string) => {
  try {
    const user = await auth.getUserByEmail(email);
    await auth.setCustomUserClaims(user.uid, { role: 'admin' });
    console.log(`Successfully created admin user for ${email}`);
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'auth/user-not-found') {
      const user = await auth.createUser({
        email,
        emailVerified: true,
      });
      await auth.setCustomUserClaims(user.uid, { role: 'admin' });
      console.log(`Successfully created admin user for ${email}`);
    } else {
      console.error(error);
    }
  }
};

const email = process.argv[2];
if (!email) {
  console.error('Please provide an email address');
  process.exit(1);
}

createAdmin(email);

//Geek+Pastor
