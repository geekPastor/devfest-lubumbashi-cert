import express from "express";
import cors, { CorsOptions } from "cors";
import { config } from "./config";
import verificationRoutes from "./routes/verification.routes";
import certificateRoutes from "./routes/certificate.routes";
import adminRoutes from "./routes/admin.routes";
import { rateLimiter, errorHandler, notFound } from "./middleware/error.middleware";
import "./firebase"; // Initialize Firebase

const app = express();

/**
 * Trust proxy is important on Cloud Run / App Hosting
 * so req.ip, rate limiting, secure cookies etc. behave correctly.
 */
app.set("trust proxy", 1);

// Body parser
app.use(express.json());

/**
 * CORS (robuste)
 * - réutilise les mêmes options pour app.use + app.options
 * - renvoie une erreur claire si origin non autorisée (au lieu de "callback(null,false)" silencieux)
 */

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (config.corsOrigins.includes(origin)) {
      return callback(null, true);
    }

    // IMPORTANT: retourner une erreur explicite aide au debug
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
};

app.use(cors(corsOptions));


// IMPORTANT: preflight (OPTIONS) doit utiliser la même config
app.options("*", cors(corsOptions));

/**
 * Optionnel mais recommandé: ne pas rate-limit les OPTIONS (preflight),
 * sinon tu peux casser CORS en prod.
 */
app.use((req, res, next) => {
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// Rate limiter après CORS/preflight
app.use(rateLimiter);

/**
 * Serve static certificates
 * ⚠️ Si tu utilises credentials/cookies, il ne faut PAS mettre '*' en Allow-Origin.
 * Ici on sert des fichiers en public, donc on laisse permissif.
 * (Si tu veux restreindre, remplace '*' par ton frontend.)
 */
app.use(
  "/certificates",
  (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    // Cache optionnel pour les assets statiques
    // res.setHeader("Cache-Control", "public, max-age=3600");
    next();
  },
  express.static(config.storage.path)
);

// Routes
app.use("/api/verify", verificationRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/admin", adminRoutes);

// 404 handler (must come after routes)
app.use(notFound);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server: Cloud Run/App Hosting fournit PORT
const port = Number(process.env.PORT) || 8080;

app.listen(port, "0.0.0.0", () => {
  console.log(`[boot] listening on ${port}`);
});
