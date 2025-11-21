import { Router } from 'express';
import multer from 'multer';
import { uploadVolunteers, getVolunteersStats } from '../controllers/admin.controller';
import { isAuthenticated, isAdmin } from '../middleware/auth.middleware';

const router = Router();

// Configure multer for file upload (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only accept CSV files
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  }
});

// Upload volunteers from CSV
router.post('/upload-volunteers', isAuthenticated, isAdmin, upload.single('file'), uploadVolunteers);

// Get volunteers statistics
router.get('/stats', isAuthenticated, isAdmin, getVolunteersStats);

export default router;
