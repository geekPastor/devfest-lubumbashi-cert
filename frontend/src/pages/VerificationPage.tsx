import React from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { verifyCertificate } from '../services/api';
import { Certificate } from '../types';
import { Footer } from '../components/Footer';

export const VerificationPage: React.FC = () => {
  const { certificateId } = useParams<{ certificateId: string }>();
  
  const { data: certificate, isLoading, error } = useQuery<Certificate>(
    ['certificate', certificateId],
    () => certificateId ? verifyCertificate(certificateId) : Promise.reject('No certificate ID'),
    {
      enabled: !!certificateId
    }
  );

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !certificate) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
        <Box
          sx={{
            background: 'linear-gradient(135deg, #EA4335 0%, #FBBC04 100%)',
            color: 'white',
            py: { xs: 3, md: 4 },
            px: 2,
            textAlign: 'center',
            mb: 4
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 600, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
            Certificate Verification
          </Typography>
        </Box>
        <Container maxWidth="md">
          <Box
            sx={{
              bgcolor: 'white',
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              p: { xs: 3, md: 4 },
              textAlign: 'center'
            }}
          >
            <Typography variant="h5" color="error" gutterBottom sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
              Certificate Not Found
            </Typography>
            <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
              The certificate you're looking for could not be verified. Please check the certificate ID and try again.
            </Typography>
          </Box>
        </Container>
        <Footer />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #4285F4 0%, #34A853 100%)',
          color: 'white',
          py: { xs: 3, md: 4 },
          px: 2,
          textAlign: 'center',
          mb: 4
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 600,
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
            }}
          >
            ✓ Verified Certificate
          </Typography>
          <Typography
            variant="body1"
            sx={{
              opacity: 0.9,
              fontSize: { xs: '0.9rem', sm: '1rem' }
            }}
          >
            This certificate has been verified and is authentic
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: 6 }}>
        <Box
          sx={{
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            p: { xs: 2, sm: 3, md: 4 }
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <img
              src={certificate.imageUrl}
              alt="Certificate"
              style={{
                width: '100%',
                maxWidth: '1000px',
                height: 'auto',
                margin: '0 auto',
                display: 'block',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
              onError={(e) => {
                console.error('Error loading certificate image:', certificate.imageUrl);
                setTimeout(() => {
                  e.currentTarget.src = certificate.imageUrl;
                }, 1000);
              }}
            />
          </Box>

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body1" gutterBottom sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
              <strong>Certificate ID:</strong> {certificate.certificateId}
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
              <strong>Issued To:</strong> {certificate.volunteerName}
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
              <strong>Issue Date:</strong> {
                certificate.issuedAt
                  ? new Date(certificate.issuedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : 'November 15, 2025'
              }
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={2} sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>
              This certificate was issued by GDG Ado-Ekiti for DevFest Ado-Ekiti 2025
            </Typography>
          </Box>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};