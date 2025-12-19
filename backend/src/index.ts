import express, { type Request, type Response, type NextFunction } from "express";
import cors, { type CorsOptions } from "cors";
import { config } from "./config";
import verificationRoutes from "./routes/verification.routes";
import certificateRoutes from "./routes/certificate.routes";
import adminRoutes from "./routes/admin.routes";
import {
  rateLimiter,
  errorHandler,
  notFound,
} from "./middleware/error.middleware";
import "./firebase"; // Initialize Firebase

const app = express();

/**
 * Trust proxy is important on Cloud Run / App Hosting / Render
 * so req.ip, rate limiting, secure cookies etc. behave correctly.
 */
app.set("trust proxy", 1);

// Body parser
app.use(express.json());

/**
 * CORS (production-safe)
 * - Reuse same options for app.use + app.options
 * - DO NOT throw/return Error in origin callback (otherwise no CORS headers => browser shows "No Access-Control-Allow-Origin")
 * - Allow requests without Origin (curl/postman/server-to-server)
 */
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const allowed = config.corsOrigins.includes(origin);
    return callback(null, allowed);
  },

  // If you don't use cookies/sessions from browser, you can set this to false.
  // Keeping true is fine as long as you NEVER use '*' for Allow-Origin on API routes.
  credentials: true,

  // Helps preflight succeed consistently
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

// Apply CORS to all routes (including errors from downstream)
app.use(cors(corsOptions));
// Explicit preflight handler
app.options("*", cors(corsOptions));

/**
 * IMPORTANT:
 * Do not rate-limit OPTIONS (preflight), otherwise browsers will fail CORS.
 * We return 204 quickly.
 */
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// Rate limiter AFTER CORS/preflight
app.use(rateLimiter);

/**
 * Serve static certificates
 * Public files: OK to be permissive. (No credentials)
 */
app.use(
  "/certificates",
  (req: Request, res: Response, next: NextFunction) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
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

// Start server: Cloud Run/App Hosting/Render provides PORT
const port = Number(process.env.PORT) || 8080;

app.listen(port, "0.0.0.0", () => {
  console.log(`[boot] listening on ${port}`);
  console.log(`[boot] allowed CORS origins: ${config.corsOrigins.join(", ")}`);
});
