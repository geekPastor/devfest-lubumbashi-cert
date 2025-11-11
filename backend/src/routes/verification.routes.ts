import { Router } from 'express';
import { check } from 'express-validator';
import * as verificationController from '../controllers/verification.controller';
import { validateRequest } from '../middleware/validate-request';

const router = Router();

router.post(
  '/email',
  [
    check('email').isEmail().withMessage('Please provide a valid email address')
  ],
  validateRequest,
  verificationController.sendVerificationCode
);

router.post(
  '/code',
  [
    check('email').isEmail().withMessage('Please provide a valid email address'),
    check('code').isLength({ min: 6, max: 6 }).withMessage('Verification code must be 6 digits')
  ],
  validateRequest,
  verificationController.verifyCode
);

export default router;