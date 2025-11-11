import { Request, Response } from 'express';
import { Volunteer } from '../models/volunteer';
import { VerificationCode } from '../models/verification-code';
import { emailService } from '../services/email.service';

// Generate a random 6-digit code
const generateCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendVerificationCode = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Check if volunteer exists
    const volunteer = await Volunteer.findOne({ email });
    if (!volunteer) {
      return res.status(404).json({
        success: false,
        error: 'Email not found in our volunteer records'
      });
    }

    // Generate verification code
    const code = generateCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15 minutes expiry

    // Save verification code
    await VerificationCode.create({
      email,
      code,
      expiresAt,
      isUsed: false
    });

    // Send email
    await emailService.sendVerificationCode(email, code);

    res.status(200).json({
      success: true,
      message: 'Verification code sent successfully'
    });
  } catch (error) {
    console.error('Error sending verification code:', error);
    res.status(500).json({
      success: false,
      error: 'Error sending verification code'
    });
  }
};

export const verifyCode = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;

    // Find the unused verification code (expires checked in model)
    const verificationCode = await VerificationCode.findOne({
      email,
      code
    });

    if (!verificationCode) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired verification code'
      });
    }

    // Mark code as used
    if (verificationCode.id) {
      await VerificationCode.findByIdAndUpdate(verificationCode.id, { isUsed: true });
    }

    // Get volunteer name
    const volunteer = await Volunteer.findOne({ email });
    if (!volunteer) {
      return res.status(404).json({
        success: false,
        error: 'Volunteer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        name: volunteer.name
      }
    });
  } catch (error) {
    console.error('Error verifying code:', error);
    res.status(500).json({
      success: false,
      error: 'Error verifying code'
    });
  }
};