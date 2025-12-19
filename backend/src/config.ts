import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  jwtSecret: string;
  email: {
    service: string;
    user: string;
    password: string;
  };
  corsOrigins: string[];
  storage: {
    type: "local" | "cloud";
    path: string;
  };
  linkedIn: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
  };
  firebase: {
    projectId: string;
    clientEmail: string;
    privateKey: string;
  };
}

/**
 * Helpers
 */
const required = (name: string, value?: string) => {
  if (!value || !value.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const parseCorsOrigins = (value?: string): string[] => {
  if (!value) return [];
  return value
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
};

const normalizeFirebasePrivateKey = (key?: string) => {
  if (!key) return "";

  // enlève guillemets éventuels
  let k = key.trim();
  k = k.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");

  // remet les vraies newlines + nettoie \r
  k = k.replace(/\\n/g, "\n").replace(/\r/g, "");

  return k;
};

const isProduction = process.env.NODE_ENV === "production";

export const config: Config = {
  // Cloud Run/App Hosting fournit PORT
  port: Number(process.env.PORT) || 5000,

  // En prod: obligatoire
  jwtSecret: isProduction
    ? required("JWT_SECRET", process.env.JWT_SECRET)
    : process.env.JWT_SECRET || "dev-secret",

  email: {
    service: process.env.EMAIL_SERVICE || "gmail",
    user: isProduction
      ? required("EMAIL_USER", process.env.EMAIL_USER)
      : process.env.EMAIL_USER || "",
    password: isProduction
      ? required("EMAIL_PASS", process.env.EMAIL_PASS)
      : process.env.EMAIL_PASS || "",
  },

  /**
   * CORS
   * En prod, passe CORS_ORIGINS dans apphosting.yaml:
   *   https://gdgl-shigenerator.web.app,https://gdgl-shigenerator.firebaseapp.com
   */
  corsOrigins: (() => {
    const fromEnv = parseCorsOrigins(process.env.CORS_ORIGINS);

    // fallback DEV uniquement
    const devDefaults = [
      "http://localhost:5173",
      "http://localhost:3000",
    ];

    // En prod, on exige une config explicite (évite les surprises)
    if (isProduction) {
      if (fromEnv.length === 0) {
        throw new Error("Missing required environment variable: CORS_ORIGINS");
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
    clientId: process.env.LINKEDIN_CLIENT_ID || "",
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "",
    redirectUri:
      process.env.LINKEDIN_REDIRECT_URI ||
      "http://localhost:5173/linkedin-callback",
  },

  firebase: {
    projectId: isProduction
      ? required("FIREBASE_PROJECT_ID", process.env.FIREBASE_PROJECT_ID)
      : process.env.FIREBASE_PROJECT_ID || "",
    clientEmail: isProduction
      ? required("FIREBASE_CLIENT_EMAIL", process.env.FIREBASE_CLIENT_EMAIL)
      : process.env.FIREBASE_CLIENT_EMAIL || "",
    privateKey: normalizeFirebasePrivateKey(
      isProduction
        ? required("FIREBASE_PRIVATE_KEY", process.env.FIREBASE_PRIVATE_KEY)
        : process.env.FIREBASE_PRIVATE_KEY
    ),
  },
};
