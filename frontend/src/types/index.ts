export interface Volunteer {
  id: string;
  name: string;
  email: string;
  role?: string;
  certificateId?: string;
  certificateUrl?: string;
  issuedAt?: Date;
}

export interface Certificate {
  id: string;
  volunteerId: string;
  volunteerName: string;
  certificateId: string;
  issuedAt: Date;
  imageUrl: string;
  verificationUrl: string;
}

export interface VerificationCode {
  email: string;
  expiresAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}