export interface IVolunteer {
  id?: string;
  name: string;
  email: string;
  role?: string;
  type?: 'volunteer' | 'speaker'; // Type of participant
  verified?: boolean; // Email verification status
  certificateId?: string;
  issuedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICertificate {
  id?: string;
  volunteerId: string;
  volunteerName: string;
  certificateId: string;
  imageUrl: string;
  verificationUrl: string;
  issuedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IVerificationCode {
  id?: string;
  email: string;
  code: string;
  expiresAt: Date;
  isUsed: boolean;
  createdAt?: Date;
}