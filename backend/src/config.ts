import dotenv from "dotenv";
dotenv.config();

interface Config {
  port: number;
  jwtSecret: string;

  email: {
    service: string;
    user?: string;       // ✅ optionnel
    password?: string;   // ✅ optionnel
  };

  corsOrigins: string[];

  storage: {
    type: "local" | "cloud";
    path: string;
  };

  linkedIn: {
    clientId?: string;
    clientSecret?: string;
    redirectUri: string;
  };

  // ✅ optionnel: sur Cloud Run on peut utiliser ADC
  firebase: {
    projectId?: string;
    clientEmail?: string;
    privateKey?: string;
  };
}

/** Helpers */
const required = (name: string, value?: string) => {
  if (!value || !value.trim()) throw new Error(`Missing required environment variable: ${name}`);
  return value.trim();
};

const warnMissing = (name: string, value?: string) => {
  if (!value || !value.trim()) {
    console.warn(`[config] WARN: env var "${name}" is missing`);
    return undefined;
  }
  return value.trim();
};

const parseCorsOrigins = (value?: string): string[] =>
  (value ?? "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

const normalizeFirebasePrivateKey = (key?: string) => {
  const v = key?.trim();
  if (!v) return undefined;

  // enlève guillemets éventuels
  let k = v.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");

  // remet les vraies newlines + nettoie \r
  k = k.replace(/\\n/g, "\n").replace(/\r/g, "");

  return k;
};

const isProduction = process.env.NODE_ENV === "production";

export const config: Config = {
  port: Number(process.env.PORT) || 8080,

  // ✅ Là oui, en prod on veut un JWT secret
  jwtSecret: isProduction
    ? required("JWT_SECRET", process.env.JWT_SECRET)
    : (process.env.JWT_SECRET || "dev-secret"),

  email: {
    service: process.env.EMAIL_SERVICE || "gmail",
    // ✅ ne pas crasher au boot si absent
    user: isProduction ? warnMissing("EMAIL_USER", process.env.EMAIL_USER) : (process.env.EMAIL_USER || undefined),
    password: isProduction ? warnMissing("EMAIL_PASS", process.env.EMAIL_PASS) : (process.env.EMAIL_PASS || undefined),
  },

  corsOrigins: (() => {
    const fromEnv = parseCorsOrigins(process.env.CORS_ORIGINS);

    const devDefaults = ["http://localhost:5173", "http://localhost:3000"];

    // ✅ fallback prod sûr (évite crash + évite ouvrir tout)
    const prodDefaults = [
      "https://gdgl-shigenerator.web.app",
      "https://gdgl-shigenerator.firebaseapp.com",
      // si tu as un domaine custom, ajoute-le ici
    ];

    if (isProduction) {
      if (fromEnv.length === 0) {
        console.warn(`[config] WARN: CORS_ORIGINS missing, using defaults: ${prodDefaults.join(", ")}`);
        return prodDefaults;
      }
      return fromEnv;
    }

    return fromEnv.length ? fromEnv : devDefaults;
  })(),

  storage: {
    type: (process.env.STORAGE_TYPE as "local" | "cloud") || "local",
    path: process.env.STORAGE_PATH || "./uploads",
  },

  linkedIn: {
    clientId: warnMissing("LINKEDIN_CLIENT_ID", process.env.LINKEDIN_CLIENT_ID),
    clientSecret: warnMissing("LINKEDIN_CLIENT_SECRET", process.env.LINKEDIN_CLIENT_SECRET),
    redirectUri: process.env.LINKEDIN_REDIRECT_URI || "http://localhost:5173/linkedin-callback",
  },

  firebase: {
    // ✅ optionnel: si absent on utilisera ADC dans firebase.ts
    projectId: warnMissing("FIREBASE_PROJECT_ID", process.env.FIREBASE_PROJECT_ID) || process.env.GCLOUD_PROJECT,
    clientEmail: warnMissing("FIREBASE_CLIENT_EMAIL", process.env.FIREBASE_CLIENT_EMAIL),
    privateKey: normalizeFirebasePrivateKey(process.env.FIREBASE_PRIVATE_KEY),
  },
};
