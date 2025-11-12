import React, { useState } from 'react';
import { Container, Stepper, Step, StepLabel, Alert, Box, Typography } from '@mui/material';
import { EmailVerificationForm } from '../components/EmailVerificationForm';
import { CodeVerificationForm } from '../components/CodeVerificationForm';
import { NameConfirmationForm } from '../components/NameConfirmationForm';
import { CertificateDisplay } from '../components/CertificateDisplay';
import { Footer } from '../components/Footer';
import { verifyEmail, verifyCode, generateCertificate, shareToLinkedIn } from '../services/api';
import { Certificate } from '../types';

const steps = [
  'Enter Email',
  'Verify Code',
  'Confirm Name',
  'Get Certificate'
];

export const CertificateFlow: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState('');
  const [verifiedName, setVerifiedName] = useState('');
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [certificateAlreadyExists, setCertificateAlreadyExists] = useState(false);
  const [linkedInDetails, setLinkedInDetails] = useState<any>(null);

  const handleEmailSubmit = async (email: string) => {
    try {
      await verifyEmail(email);
      setEmail(email);
      setActiveStep(1);
    } catch (error) {
      console.error('Error verifying email:', error);
      throw error;
    }
  };

  const handleCodeSubmit = async (code: string) => {
    try {
      const response = await verifyCode(email, code);
      setVerifiedName(response.data.name);
      setActiveStep(2);
    } catch (error) {
      console.error('Error verifying code:', error);
      throw error;
    }
  };

  const handleResendCode = async () => {
    try {
      await verifyEmail(email);
    } catch (error) {
      console.error('Error resending code:', error);
      throw error;
    }
  };

  const handleNameSubmit = async (name: string) => {
    try {
      const response = await generateCertificate(email, name);
      console.log('Certificate Response:', response);
      console.log('Certificate Data:', response.data);

      // Check if certificate already exists
      if (response.alreadyExists) {
        setCertificateAlreadyExists(true);
      } else {
        setCertificateAlreadyExists(false);
      }

      // Set the certificate data
      if (response.data) {
        setCertificate(response.data);
        console.log('Certificate set:', response.data);
      } else {
        console.error('No certificate data in response');
      }

      setActiveStep(3);
    } catch (error) {
      console.error('Error generating certificate:', error);
      throw error;
    }
  };

  const handleDownload = async () => {
    if (certificate) {
      try {
        // Dynamically import jsPDF
        const { jsPDF } = await import('jspdf');

        // Fetch the certificate image
        const response = await fetch(certificate.imageUrl);
        const blob = await response.blob();

        // Create image URL
        const imageUrl = window.URL.createObjectURL(blob);

        // Load the image to get dimensions
        const img = new Image();
        img.src = imageUrl;

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        // Certificate dimensions: 1748 x 1240 px
        // Convert to PDF dimensions (using mm, A4 landscape-like)
        // A4 landscape is 297 x 210 mm
        // We'll use custom size to maintain aspect ratio
        const pdfWidth = 297; // mm (A4 width)
        const pdfHeight = (1240 / 1748) * pdfWidth; // maintain aspect ratio

        // Create PDF in landscape orientation with custom size
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: [pdfHeight, pdfWidth]
        });

        // Add image to PDF (full page)
        pdf.addImage(img.src, 'PNG', 0, 0, pdfWidth, pdfHeight);

        // Download the PDF
        pdf.save(`${certificate.certificateId}.pdf`);

        // Clean up
        window.URL.revokeObjectURL(imageUrl);
      } catch (error) {
        console.error('Error downloading certificate as PDF:', error);
        // Fallback to opening in new tab
        window.open(certificate.imageUrl, '_blank');
      }
    }
  };

  const handleShareLinkedIn = async () => {
    if (certificate) {
      try {
        // Call backend API to get LinkedIn URLs
        const response = await shareToLinkedIn(certificate.certificateId);
        if (response.success && response.data) {
          // Save details to show in alert
          setLinkedInDetails(response.data.certificateDetails);

          // Copy credential URL to clipboard for easy pasting
          await navigator.clipboard.writeText(response.data.certificateDetails.credentialUrl);

          // Open LinkedIn certifications page where user can manually add the certificate
          window.open(response.data.addToProfileUrl, '_blank', 'width=900,height=700');
        }
      } catch (error) {
        console.error('Error sharing to LinkedIn:', error);
        // Fallback to sharing verification link as post if API fails
        const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certificate.verificationUrl)}`;
        window.open(shareUrl, '_blank', 'width=600,height=600');
      }
    }
  };

  const handleCopyVerificationLink = () => {
    if (certificate) {
      navigator.clipboard.writeText(certificate.verificationUrl);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #4285F4 0%, #34A853 100%)',
          color: 'white',
          py: { xs: 4, md: 6 },
          px: 2,
          textAlign: 'center',
          mb: 4
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
            }}
          >
            DevFest Ado-Ekiti 2025
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 3,
              opacity: 0.95,
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}
          >
            Certificate of Appreciation for Volunteers and Speakers
          </Typography>
          <Typography
            variant="body1"
            sx={{
              maxWidth: '600px',
              mx: 'auto',
              opacity: 0.9,
              fontSize: { xs: '0.9rem', sm: '1rem' }
            }}
          >
            Thank you for your dedication and contribution to making DevFest Ado-Ekiti 2025 a success.
            Get your official certificate of appreciation below.
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ pb: 6 }}>
        <Box
          sx={{
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            p: { xs: 2, sm: 3, md: 4 }
          }}
        >
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 && (
            <EmailVerificationForm onSubmit={handleEmailSubmit} />
          )}

      {activeStep === 1 && (
        <CodeVerificationForm
          onSubmit={handleCodeSubmit}
          onResendCode={handleResendCode}
          email={email}
        />
      )}

      {activeStep === 2 && (
        <NameConfirmationForm
          defaultName={verifiedName}
          onSubmit={handleNameSubmit}
        />
      )}

      {activeStep === 3 && certificate && (
        <>
          {certificateAlreadyExists && (
            <Box sx={{ mb: 3 }}>
              <Alert severity="info">
                <strong>Certificate Already Exists!</strong> You've previously generated a certificate for this email.
                Here's your existing certificate - you can download it again or share it on LinkedIn.
              </Alert>
            </Box>
          )}
          {linkedInDetails && (
            <Box sx={{ mb: 3 }}>
              <Alert
                severity="success"
                onClose={() => setLinkedInDetails(null)}
              >
                <strong>LinkedIn Certification Page Opened!</strong>
                <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
                  Your credential URL has been copied to clipboard. Please manually add this certification with the following details:
                </Typography>
                <Typography variant="body2" component="div" sx={{ mt: 1 }}>
                  <strong>Name:</strong> {linkedInDetails.name}<br />
                  <strong>Organization:</strong> {linkedInDetails.organization}<br />
                  <strong>Issue Date:</strong> {linkedInDetails.issueDate}<br />
                  <strong>Credential ID:</strong> {linkedInDetails.certificateId}<br />
                  <strong>Credential URL:</strong> {linkedInDetails.credentialUrl}
                </Typography>
              </Alert>
            </Box>
          )}
          <CertificateDisplay
            certificate={certificate}
            onDownload={handleDownload}
            onShareLinkedIn={handleShareLinkedIn}
            onCopyVerificationLink={handleCopyVerificationLink}
          />
        </>
      )}
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};