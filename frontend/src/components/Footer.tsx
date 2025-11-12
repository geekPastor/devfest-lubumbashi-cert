import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: '#f5f5f5',
        borderTop: '1px solid #e0e0e0',
        textAlign: 'center'
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {currentYear} | With ❤️ by{' '}
        <Link
          href="https://stont.dev/"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: '#4285F4', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
        >
          David Oluwabusayo
        </Link>
        {' '}&{' '}
        <Link
          href="https://gdg.community.dev/gdg-ado-ekiti"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: '#4285F4', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
        >
          GDG Ado-Ekiti
        </Link>
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        <Link
          href="https://github.com/stont/devfestcert"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: '#4285F4',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          <GitHubIcon sx={{ fontSize: 18 }} />
          Open Source
        </Link>
      </Typography>
    </Box>
  );
};
