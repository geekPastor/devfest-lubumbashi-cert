import admin from "firebase-admin";
import { config } from "../config";

const hasServiceAccount =
  !!config.firebase.projectId &&
  !!config.firebase.clientEmail &&
  !!config.firebase.privateKey;

if (!admin.apps.length) {
  if (hasServiceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: config.firebase.projectId!,
        clientEmail: config.firebase.clientEmail!,
        privateKey: config.firebase.privateKey!, // ✅ safe grâce au guard
      }),
    });
  } else {
    // Sur Cloud Run/App Hosting: ADC
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: config.firebase.projectId || process.env.GCLOUD_PROJECT,
    });
  }
}
