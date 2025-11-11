import React from 'react';
import { Box, Button, Card, CardMedia, CardActions, Typography } from '@mui/material';
import { LinkedIn, Download, Link as LinkIcon } from '@mui/icons-material';
import { Certificate } from '../types';

interface CertificateDisplayProps {
  certificate: Certificate;
  onDownload: () => void;
  onShareLinkedIn: () => void;
  onCopyVerificationLink: () => void;
}

export const CertificateDisplay: React.FC<CertificateDisplayProps> = ({
  certificate,
  onDownload,
  onShareLinkedIn,
  onCopyVerificationLink,
}) => {
  console.log('CertificateDisplay - certificate:', certificate);
  console.log('CertificateDisplay - imageUrl:', certificate?.imageUrl);

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', mt: 4 }}>
      <Card>
        {certificate?.imageUrl ? (
          <CardMedia
            component="img"
            image={certificate.imageUrl}
            alt="Certificate"
            sx={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain'
            }}
            onError={() => {
              console.error('Error loading certificate image:', certificate.imageUrl);
            }}
          />
        ) : (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="error">No certificate image available</Typography>
          </Box>
        )}
        
        <CardActions sx={{ justifyContent: 'center', flexWrap: 'wrap', gap: 1, p: 2 }}>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={onDownload}
          >
            Download Certificate
          </Button>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<LinkedIn />}
            onClick={onShareLinkedIn}
          >
            Share on LinkedIn
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<LinkIcon />}
            onClick={onCopyVerificationLink}
          >
            Copy Verification Link
          </Button>
        </CardActions>
      </Card>

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Certificate ID: {certificate.certificateId}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Issue Date: {
            certificate.issuedAt
              ? new Date(certificate.issuedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              : 'November 15, 2025'
          }
        </Typography>
      </Box>
    </Box>
  );
};