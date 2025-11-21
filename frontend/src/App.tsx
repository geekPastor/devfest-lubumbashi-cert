import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from './theme';
import { CertificateFlow } from './pages/CertificateFlow';
import { VerificationPage } from './pages/VerificationPage';
import { AdminUploadPage } from './pages/AdminUploadPage';
import AdminLoginPage from './pages/AdminLoginPage';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

const queryClient = new QueryClient();

const AdminRoute = () => {
  const [user, loading] = useAuthState(auth!);

  // If Firebase is not configured, show a message
  if (!auth) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Admin Authentication Not Configured</h2>
        <p>Please configure Firebase environment variables to enable admin features.</p>
      </div>
    );
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/admin/login" />;
  }

  return <AdminUploadPage />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<CertificateFlow />} />
            <Route path="/verify/:certificateId" element={<VerificationPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/upload" element={<AdminRoute />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;