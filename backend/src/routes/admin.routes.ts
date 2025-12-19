import { Router, type Request } from "express";
import multer, { type FileFilterCallback } from "multer";
import {
  uploadVolunteers,
  getVolunteersStats,
} from "../controllers/admin.controller";
import { isAuthenticated, isAdmin } from "../middleware/auth.middleware";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const isCsv =
      file.mimetype === "text/csv" ||
      file.originalname.toLowerCase().endsWith(".csv");

    if (isCsv) return cb(null, true);
    return cb(new Error("Only CSV files are allowed"));
  },
});

// Upload volunteers from CSV
router.post(
  "/upload-volunteers",
  isAuthenticated,
  isAdmin,
  upload.single("file"),
  uploadVolunteers
);

// Get volunteers statistics
router.get("/stats", isAuthenticated, isAdmin, getVolunteersStats);

export default router;
