import { Router } from 'express';
import { check } from 'express-validator';
import * as certificateController from '../controllers/certificate.controller';
import { validateRequest } from '../middleware/validate-request';

const router = Router();

router.post(
  '/generate',
  [
    check('email').isEmail().withMessage('Please provide a valid email address'),
    check('name')
      .isLength({ min: 1, max: 50 })
      .withMessage('Name must be between 1 and 50 characters')
  ],
  validateRequest,
  certificateController.generateCertificate
);

router.get(
  '/verify/:certificateId',
  certificateController.verifyCertificate
);

router.post(
  '/:certificateId/share/linkedin',
  certificateController.shareToLinkedIn
);

export default router;