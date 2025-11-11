import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from './theme';
import { CertificateFlow } from './pages/CertificateFlow';
import { VerificationPage } from './pages/VerificationPage';
import { AdminUploadPage } from './pages/AdminUploadPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<CertificateFlow />} />
            <Route path="/verify/:certificateId" element={<VerificationPage />} />
            <Route path="/admin/upload" element={<AdminUploadPage />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;