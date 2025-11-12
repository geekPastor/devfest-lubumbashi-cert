import { Request, Response } from 'express';
import { Volunteer } from '../models/volunteer';
import { Certificate } from '../models/certificate';
import { certificateService } from '../services/certificate.service';
import { emailService } from '../services/email.service';

const generateCertificateId = async (type: 'volunteer' | 'speaker' = 'volunteer'): Promise<string> => {
  const count = await Certificate.countDocuments();
  const paddedNumber = (count + 1).toString().padStart(4, '0');
  const prefix = type === 'speaker' ? 'SPK' : 'VOL';
  return `DFAE2025-${prefix}-${paddedNumber}`;
};

export const generateCertificate = async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;

    // Find volunteer
    const volunteer = await Volunteer.findOne({ email });
    if (!volunteer) {
      return res.status(404).json({
        success: false,
        error: 'Volunteer not found'
      });
    }

    // Check if certificate already exists for this volunteer
    if (volunteer.id) {
      const existingCertificate = await Certificate.findByVolunteerId(volunteer.id);

      if (existingCertificate) {
        console.log('Existing certificate found:', existingCertificate);

        // Serialize existing certificate data
        const serializedCertificate = {
          ...existingCertificate,
          issuedAt: existingCertificate.issuedAt instanceof Date
            ? existingCertificate.issuedAt.toISOString()
            : existingCertificate.issuedAt,
          createdAt: existingCertificate.createdAt instanceof Date
            ? existingCertificate.createdAt.toISOString()
            : existingCertificate.createdAt,
          updatedAt: existingCertificate.updatedAt instanceof Date
            ? existingCertificate.updatedAt.toISOString()
            : existingCertificate.updatedAt
        };

        console.log('Serialized certificate:', serializedCertificate);

        return res.status(200).json({
          success: true,
          message: 'Certificate already exists for this email',
          alreadyExists: true,
          data: serializedCertificate
        });
      }
    }

    // Get volunteer type (default to 'volunteer' if not specified)
    const volunteerType = volunteer.type || 'volunteer';

    // Generate unique certificate ID based on type
    const certificateId = await generateCertificateId(volunteerType);

    // Generate certificate image with appropriate type
    const { imageUrl } = await certificateService.createCertificate(
      name,
      certificateId,
      volunteerType
    );

    console.log('Generated certificate image URL:', imageUrl);

    // Create verification URL
    const verificationUrl = `${process.env.FRONTEND_URL}/verify/${certificateId}`;

    // Fixed event date: November 15, 2025
    const eventDate = new Date('2025-11-15');

    // Create certificate record
    const certificate = await Certificate.create({
      volunteerId: volunteer.id || '',
      volunteerName: name,
      certificateId,
      imageUrl,
      verificationUrl,
      issuedAt: eventDate
    });

    // Update volunteer record
    if (volunteer.id) {
      await Volunteer.findByIdAndUpdate(volunteer.id, {
        certificateId,
        issuedAt: eventDate
      });
    }

    // Send email with certificate
    await emailService.sendCertificateEmail(email, imageUrl, verificationUrl);

    // Serialize certificate data with proper date formatting
    const serializedCertificate = {
      ...certificate,
      issuedAt: certificate.issuedAt instanceof Date
        ? certificate.issuedAt.toISOString()
        : certificate.issuedAt,
      createdAt: certificate.createdAt instanceof Date
        ? certificate.createdAt.toISOString()
        : certificate.createdAt,
      updatedAt: certificate.updatedAt instanceof Date
        ? certificate.updatedAt.toISOString()
        : certificate.updatedAt
    };

    res.status(201).json({
      success: true,
      data: serializedCertificate
    });
  } catch (error) {
    console.error('Error generating certificate:', error);
    res.status(500).json({
      success: false,
      error: 'Error generating certificate'
    });
  }
};

export const verifyCertificate = async (req: Request, res: Response) => {
  try {
    const { certificateId } = req.params;

    const certificate = await Certificate.findOne({ certificateId });
    if (!certificate) {
      return res.status(404).json({
        success: false,
        error: 'Certificate not found'
      });
    }

    // Serialize certificate data with proper date formatting
    const serializedCertificate = {
      ...certificate,
      issuedAt: certificate.issuedAt instanceof Date
        ? certificate.issuedAt.toISOString()
        : certificate.issuedAt,
      createdAt: certificate.createdAt instanceof Date
        ? certificate.createdAt.toISOString()
        : certificate.createdAt,
      updatedAt: certificate.updatedAt instanceof Date
        ? certificate.updatedAt.toISOString()
        : certificate.updatedAt
    };

    res.status(200).json({
      success: true,
      data: serializedCertificate
    });
  } catch (error) {
    console.error('Error verifying certificate:', error);
    res.status(500).json({
      success: false,
      error: 'Error verifying certificate'
    });
  }
};

export const shareToLinkedIn = async (req: Request, res: Response) => {
  try {
    const { certificateId } = req.params;

    const certificate = await Certificate.findOne({ certificateId });
    if (!certificate) {
      return res.status(404).json({
        success: false,
        error: 'Certificate not found'
      });
    }

    // Get volunteer information to determine type
    const volunteer = await Volunteer.findById(certificate.volunteerId);
    const volunteerType = volunteer?.type || 'volunteer';

    // Create appropriate certificate name based on type
    const certificateName = volunteerType === 'speaker'
      ? 'DevFest Ado-Ekiti 2025 - Speaker'
      : 'DevFest Ado-Ekiti 2025 - Volunteer';

    // Try the profile/add URL format with organization ID - this may work for adding to profile
    const addToProfileUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(certificateName)}&organizationId=100054142&issueYear=2025&issueMonth=1&certId=${certificateId}&certUrl=${encodeURIComponent(certificate.verificationUrl)}`;

    res.status(200).json({
      success: true,
      data: {
        addToProfileUrl,
        certificateDetails: {
          name: certificateName,
          organization: 'GDG Ado-Ekiti',
          issueDate: 'January 2025',
          certificateId: certificateId,
          credentialUrl: certificate.verificationUrl
        }
      }
    });
  } catch (error) {
    console.error('Error sharing to LinkedIn:', error);
    res.status(500).json({
      success: false,
      error: 'Error sharing to LinkedIn'
    });
  }
};