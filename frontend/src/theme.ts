import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#4285F4', // Google Blue
      light: '#85B4FF',
      dark: '#0059C1',
    },
    secondary: {
      main: '#EA4335', // Google Red
      light: '#FF7961',
      dark: '#B31412',
    },
    success: {
      main: '#34A853', // Google Green
      light: '#6FDC8C',
      dark: '#007B1F',
    },
    warning: {
      main: '#FBBC04', // Google Yellow
      light: '#FFF475',
      dark: '#C49000',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '10px 24px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});