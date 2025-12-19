import admin from "firebase-admin";

// ... ton init()

export const db = admin.firestore();
export const auth = admin.auth();

// ✅ AJOUTE ÇA :
export const storage = admin.storage();


const isRunningOnGCP =
  !!process.env.K_SERVICE || // Cloud Run
  !!process.env.GOOGLE_CLOUD_PROJECT;

function init() {
  if (admin.apps.length) return;

  // 1) Sur Cloud Run / Firebase App Hosting => Application Default Credentials
  if (isRunningOnGCP) {
    admin.initializeApp();
    return;
  }

  // 2) Local / hors GCP => via variables d'env
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKeyRaw) {
    throw new Error(
      "Firebase Admin not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY for local dev."
    );
  }

  const privateKey = privateKeyRaw
    .trim()
    .replace(/^"(.*)"$/, "$1")
    .replace(/^'(.*)'$/, "$1")
    .replace(/\\n/g, "\n")
    .replace(/\r/g, "");

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

init();
