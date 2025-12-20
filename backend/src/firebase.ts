import admin from "firebase-admin";
import { config } from "./config";

/**
 * Récupère le storageBucket depuis :
 * - FIREBASE_STORAGE_BUCKET (si tu le fournis)
 * - FIREBASE_CONFIG (json fourni par Firebase / App Hosting)
 * - fallback: `${projectId}.appspot.com` (classique)
 */
function resolveStorageBucket(): string | undefined {
  if (process.env.FIREBASE_STORAGE_BUCKET?.trim()) {
    return process.env.FIREBASE_STORAGE_BUCKET.trim();
  }

  // Sur Firebase App Hosting, FIREBASE_CONFIG existe souvent
  const raw = process.env.FIREBASE_CONFIG;
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.storageBucket) return String(parsed.storageBucket);
    } catch {
      // ignore
    }
  }

  // Fallback "classique" pour Firebase Storage
  const projectId = config.firebase.projectId || process.env.GCLOUD_PROJECT;
  if (projectId) return `${projectId}.appspot.com`;

  return undefined;
}

if (!admin.apps.length) {
  const storageBucket = resolveStorageBucket();

  // Si secrets service account fournis -> cert()
  if (config.firebase.clientEmail && config.firebase.privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: config.firebase.projectId,
        clientEmail: config.firebase.clientEmail,
        privateKey: config.firebase.privateKey,
      }),
      storageBucket,
    });
  } else {
    // Sinon -> Application Default Credentials (Cloud Run / App Hosting)
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: config.firebase.projectId || process.env.GCLOUD_PROJECT,
      storageBucket,
    });
  }
}

export const db = admin.firestore();

// ✅ Ce que ton code attendait :
export const auth = admin.auth();

// ✅ Pour storage.service.ts
export const storage = admin.storage();
