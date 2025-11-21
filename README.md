# DevFest Ado-Ekiti 2025 - Certificate System

> A secure, digital certificate system to recognize and appreciate volunteers and speakers who contributed to DevFest Ado-Ekiti 2025.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://cert.gdgadoekiti.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🌐 Live Application

**Website:** [https://cert.gdgadoekiti.com/](https://cert.gdgadoekiti.com/)

## 📋 Overview

The DevFest Certificate System is a comprehensive web application that allows volunteers and speakers to claim and share their official certificates of appreciation for DevFest Ado-Ekiti 2025. The system features email verification, certificate generation, LinkedIn integration, and public certificate verification.

## ✨ Features

### For Certificate Recipients
- **Email Verification System**: Secure 6-digit code verification sent to registered emails
- **Name Customization**: Edit and confirm your name before certificate generation
- **Certificate Generation**: Automatically generated certificates with unique IDs
- **Multiple Download Options**: Download certificates as PNG or PDF
- **LinkedIn Integration**: Share certificates and add to LinkedIn profile
- **Public Verification**: Each certificate includes a unique verification link

### For Administrators
- **Firebase Authentication**: Admin routes protected with Firebase Authentication
- **Role-Based Access Control**: Admin-only access using custom claims
- **Bulk Upload**: Upload volunteer/speaker lists via CSV
- **Certificate Management**: Track all issued certificates
- **Database Cleanup**: Tools to manage volunteer data

### Security Features
- **Email Verification**: Only registered volunteers/speakers can claim certificates
- **One-time Verification Codes**: 6-digit codes expire after 15 minutes
- **Unique Certificate IDs**: Each certificate has a unique identifier (e.g., DFAE2025-VOL-0001)
- **Public Verification**: Anyone can verify certificate authenticity
- **Admin Authentication**: Firebase Authentication with role-based access control for admin routes

## 🏗️ Project Structure

```
certification/
├── frontend/              # React + TypeScript + Vite frontend
│   ├── src/
│   │   ├── components/   # Reusable React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── types/        # TypeScript type definitions
│   └── package.json
│
├── backend/              # Node.js + TypeScript + Express backend
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── scripts/      # Utility scripts
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Firebase project (for Firestore and Storage)
- Email service credentials (e.g., Gmail, SendGrid)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/stont/devfestcert.git
   cd devfestcert
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**

   Copy the example environment files and fill in your credentials:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

   **Backend** (`backend/.env`):
   ```env
   PORT=5000
   NODE_ENV=development

   # Firebase Configuration
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_PRIVATE_KEY=your_private_key
   FIREBASE_CLIENT_EMAIL=your_client_email

   # Storage
   STORAGE_BUCKET=your_storage_bucket

   # Email Configuration
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   EMAIL_FROM=DevFest Ado-Ekiti <noreply@gdgadoekiti.com>

   # Frontend URL
   FRONTEND_URL=http://localhost:3000

   # CORS
   CORS_ORIGIN=http://localhost:3000
   ```

   **Frontend** (`frontend/.env.production` and `frontend/.env`):
   ```env
   VITE_API_URL=https://your-backend-url.com

   # Firebase Configuration (for Admin Authentication)
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 📦 Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router v6
- **State Management**: React Query
- **HTTP Client**: Axios
- **PDF Generation**: jsPDF

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js with TypeScript
- **Database**: Firebase Firestore
- **Storage**: Firebase Cloud Storage
- **Email**: Nodemailer
- **Image Processing**: Sharp
- **Certificate Generation**: Canvas

### Deployment
- **Frontend**: Firebase Hosting
- **Backend**: Google Cloud Run
- **Database**: Firebase Firestore
- **Storage**: Firebase Cloud Storage

## 🔧 Development

### Frontend Development
```bash
cd frontend
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

### Backend Development
```bash
cd backend
npm run dev        # Start development server with auto-reload
npm run build      # Compile TypeScript
npm start          # Start production server
```

### Utility Scripts
```bash
cd backend

# Upload volunteers from CSV
npm run upload-csv

# Clean database
npm run clean-db

# Create admin user
npm run create-admin <admin-email>
```

### Admin Setup

To access admin features, you need to create an admin user with Firebase Authentication:

1. **Create a Firebase user** in the Firebase Console or use the create-admin script:
   ```bash
   cd backend
   npm run create-admin admin@example.com
   ```

2. **Configure Frontend Authentication**:
   - The frontend uses Firebase Authentication to sign in admin users
   - Admin users will have access to protected routes like `/admin/upload`

3. **Admin Routes**:
   - All admin routes require Firebase Authentication token
   - The backend verifies the token and checks for admin role using custom claims
   - Unauthorized access attempts are automatically rejected

## 📝 API Documentation

### Certificate Generation Flow

1. **Verify Email**
   ```
   POST /api/verify/email
   Body: { email: string }
   ```

2. **Verify Code**
   ```
   POST /api/verify/code
   Body: { email: string, code: string }
   ```

3. **Generate Certificate**
   ```
   POST /api/certificates/generate
   Body: { email: string, name: string }
   ```

4. **Verify Certificate**
   ```
   GET /api/certificates/verify/:certificateId
   ```

### Admin API Endpoints

**Note**: All admin routes require Firebase Authentication token in the Authorization header.

1. **Upload Volunteers (CSV)**
   ```
   POST /api/admin/upload-volunteers
   Headers: { Authorization: Bearer <firebase-token> }
   Body: FormData with CSV file
   ```

2. **Get Statistics**
   ```
   GET /api/admin/stats
   Headers: { Authorization: Bearer <firebase-token> }
   ```

## 🎨 Certificate Design

Certificates feature:
- Google's 4-color branding (Blue, Red, Yellow, Green)
- Volunteer/Speaker name
- Unique certificate ID
- Issue date
- GDG Ado-Ekiti branding
- Public verification URL
- Digital signature

## 🔐 Security

- Email verification required for all certificate claims
- One-time verification codes with 15-minute expiration
- Unique certificate IDs prevent duplication
- Public verification URLs for authenticity checks
- CORS protection on API endpoints
- Firebase Authentication for admin routes
- Role-based access control using Firebase custom claims
- Rate limiting on API endpoints

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributors

- **David Oluwabusayo** - [stont.dev](https://stont.dev/)
- **GDG Ado-Ekiti** - [gdg.community.dev/gdg-ado-ekiti](https://gdg.community.dev/gdg-ado-ekiti)

## 🙏 Acknowledgments

- Google Developer Groups for the amazing DevFest program
- All volunteers and speakers who made DevFest Ado-Ekiti 2025 a success
- The open-source community for the amazing tools and libraries

## 📞 Support

For support, email [amdjflow@gmail.com](mailto:amdjflow@gmail.com) or visit our [GDG Community page](https://gdg.community.dev/gdg-ado-ekiti).

---

Made with ❤️ by [David Oluwabusayo](https://stont.dev/) & [GDG Ado-Ekiti](https://gdg.community.dev/gdg-ado-ekiti)
