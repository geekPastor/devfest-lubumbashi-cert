# DevFest Certificate System

This repository contains both the frontend and backend code for the DevFest Ado-Ekiti 2025 Volunteer Certificate System.

## Project Structure

```
certification/
├── frontend/           # React + TypeScript frontend
├── backend/            # Node.js + TypeScript backend
└── PROJECT_INFO.md     # Product Requirements Document
```

## Getting Started

1. Install dependencies:
   ```bash
   npm run install:all
   ```

2. Set up environment variables:
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Fill in the required environment variables

3. Start development servers:
   ```bash
   npm run dev
   ```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
VITE_LINKEDIN_CLIENT_ID=your_linkedin_client_id
```

### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL_SERVICE=your_email_service
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
CORS_ORIGIN=http://localhost:3000
```

## Features

- Email verification system
- Certificate generation and management
- LinkedIn integration
- Public certificate verification
- Admin dashboard
- Secure authentication

## Technologies Used

### Frontend
- React 18 with TypeScript
- Material UI (MUI)
- React Router
- Axios
- React Query

### Backend
- Node.js with TypeScript
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- NodeMailer
- Sharp (for image processing)

## Development

### Frontend Development
```bash
cd frontend
npm run dev
```

### Backend Development
```bash
cd backend
npm run dev
```

## Testing
```bash
# Run frontend tests
cd frontend && npm test

# Run backend tests
cd backend && npm test
```

## Deployment

Instructions for deployment will be added once the development phase is complete.

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests
4. Submit a pull request

## License

MIT License