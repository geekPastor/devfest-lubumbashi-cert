import nodemailer from 'nodemailer';
import { config } from '../config';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: config.email.service,
      auth: {
        user: config.email.user,
        pass: config.email.password
      }
    });
  }

  async sendVerificationCode(email: string, code: string): Promise<void> {
    const mailOptions = {
      from: `"GDG Ado-Ekiti" <${config.email.user}>`,
      to: email,
      subject: 'DevFest Ado-Ekiti 2025 - Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4285F4;">DevFest Ado-Ekiti 2025</h2>
          <p>Hello,</p>
          <p>Your verification code for the DevFest Ado-Ekiti 2025 Certificate System is:</p>
          <h1 style="color: #4285F4; font-size: 32px; letter-spacing: 5px;">${code}</h1>
          <p>This code will expire in 15 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
          <p>Best regards,<br>GDG Ado-Ekiti Team</p>
        </div>
      `
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendCertificateEmail(email: string, certificateUrl: string, verificationUrl: string): Promise<void> {
    const mailOptions = {
      from: `"GDG Ado-Ekiti" <${config.email.user}>`,
      to: email,
      subject: 'DevFest Ado-Ekiti 2025 - Your Certificate',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4285F4;">DevFest Ado-Ekiti 2025</h2>
          <p>Hello,</p>
          <p>Thank you for volunteering at DevFest Ado-Ekiti 2025! Your certificate has been generated.</p>
          <p>You can:</p>
          <ul>
            <li><a href="${certificateUrl}">Download your certificate</a></li>
            <li><a href="${verificationUrl}">View the verification page</a></li>
          </ul>
          <p>We appreciate your contribution to making DevFest Ado-Ekiti 2025 a success!</p>
          <p>Best regards,<br>GDG Ado-Ekiti Team</p>
        </div>
      `
    };

    await this.transporter.sendMail(mailOptions);
  }
}

export const emailService = new EmailService();