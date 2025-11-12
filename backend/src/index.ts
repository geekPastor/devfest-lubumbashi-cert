import express from 'express';
import cors from 'cors';
import { config } from './config';
import verificationRoutes from './routes/verification.routes';
import certificateRoutes from './routes/certificate.routes';
import adminRoutes from './routes/admin.routes';
import { rateLimiter, errorHandler, notFound } from './middleware/error.middleware';
import './firebase'; // Initialize Firebase

const app = express();

// Middleware
app.use(express.json());

// CORS - Allow configured origins
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or server-to-server)
    if (!origin) return callback(null, true);

    // Check if origin is in allowed list
    if (config.corsOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true
}));

app.use(rateLimiter);

// Serve static certificates with CORS headers
app.use('/certificates', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}, express.static(config.storage.path));

// Routes
app.use('/api/verify', verificationRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler (must come after routes)
app.use(notFound);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});