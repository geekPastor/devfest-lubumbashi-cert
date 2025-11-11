import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  jwtSecret: string;
  email: {
    service: string;
    user: string;
    password: string;
  };
  corsOrigin: string;
  storage: {
    type: 'local' | 'cloud';
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

export const config: Config = {
  port: Number(process.env.PORT) || 5000,
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  email: {
    service: process.env.EMAIL_SERVICE || 'gmail',
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASS || ''
  },
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  storage: {
    type: (process.env.STORAGE_TYPE as 'local' | 'cloud') || 'local',
    path: process.env.STORAGE_PATH || './uploads'
  },
  linkedIn: {
    clientId: process.env.LINKEDIN_CLIENT_ID || '',
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
    redirectUri: process.env.LINKEDIN_REDIRECT_URI || 'http://localhost:3000/linkedin-callback'
  },
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
    privateKey: process.env.FIREBASE_PRIVATE_KEY || ''
  }
};