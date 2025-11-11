import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Alert,
  Paper,
  LinearProgress,
  Chip,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import { CloudUpload, CheckCircle, Error as ErrorIcon } from '@mui/icons-material';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface UploadResult {
  total: number;
  created: number;
  updated: number;
  errors: Array<{ row: number; email: string; error: string }>;
}

interface Stats {
  total: number;
  volunteers: number;
  speakers: number;
  certified: number;
  pending: number;
}

export const AdminUploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  React.useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/stats`);
      setStats(response.data.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setError(null);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_URL}/api/admin/upload-volunteers`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setResult(response.data.data);
      setFile(null);
      // Refresh stats
      await fetchStats();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = 'name,email,role,type\nJohn Doe,john@example.com,Volunteer,volunteer\nJane Smith,jane@example.com,Speaker,speaker';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'volunteers_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Header */}
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
            Admin - Upload Volunteers & Speakers
          </Typography>
          <Typography
            variant="body1"
            sx={{
              opacity: 0.9,
              fontSize: { xs: '0.9rem', sm: '1rem' }
            }}
          >
            Upload CSV files to add volunteers and speakers to the system
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ pb: 6 }}>
        {/* Statistics */}
        {stats && (
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={6} sm={4}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">{stats.total}</Typography>
                  <Typography variant="body2" color="text.secondary">Total</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">{stats.volunteers}</Typography>
                  <Typography variant="body2" color="text.secondary">Volunteers</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="warning.main">{stats.speakers}</Typography>
                  <Typography variant="body2" color="text.secondary">Speakers</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="info.main">{stats.certified}</Typography>
                  <Typography variant="body2" color="text.secondary">Certified</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="text.secondary">{stats.pending}</Typography>
                  <Typography variant="body2" color="text.secondary">Pending</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Upload Section */}
        <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Upload CSV File
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              <strong>CSV Format:</strong> Your CSV file should have columns: name, email, role (optional), type (volunteer/speaker)
            </Alert>

            <Button
              variant="outlined"
              onClick={downloadTemplate}
              size="small"
              sx={{ mb: 2 }}
            >
              Download Template
            </Button>
          </Box>

          <Box sx={{ mb: 3 }}>
            <input
              accept=".csv"
              style={{ display: 'none' }}
              id="csv-file-upload"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="csv-file-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={<CloudUpload />}
                fullWidth
                sx={{ mb: 2 }}
              >
                Select CSV File
              </Button>
            </label>

            {file && (
              <Box sx={{ mb: 2 }}>
                <Chip
                  label={file.name}
                  onDelete={() => setFile(null)}
                  color="primary"
                  variant="outlined"
                />
              </Box>
            )}

            <Button
              variant="contained"
              color="success"
              fullWidth
              onClick={handleUpload}
              disabled={!file || uploading}
            >
              {uploading ? 'Uploading...' : 'Upload Volunteers'}
            </Button>
          </Box>

          {uploading && <LinearProgress />}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {result && (
            <Box sx={{ mt: 3 }}>
              <Alert severity="success" icon={<CheckCircle />}>
                <Typography variant="subtitle1" gutterBottom>
                  Upload Complete!
                </Typography>
                <Typography variant="body2">
                  • Created: {result.created} new records<br />
                  • Updated: {result.updated} existing records<br />
                  • Total processed: {result.total}
                </Typography>
              </Alert>

              {result.errors.length > 0 && (
                <Alert severity="warning" icon={<ErrorIcon />} sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    {result.errors.length} errors occurred:
                  </Typography>
                  {result.errors.slice(0, 5).map((err, idx) => (
                    <Typography key={idx} variant="body2">
                      • Row {err.row} ({err.email}): {err.error}
                    </Typography>
                  ))}
                  {result.errors.length > 5 && (
                    <Typography variant="body2">
                      ... and {result.errors.length - 5} more errors
                    </Typography>
                  )}
                </Alert>
              )}
            </Box>
          )}
        </Paper>

        {/* Instructions */}
        <Paper sx={{ p: { xs: 2, sm: 3 }, bgcolor: '#f9f9f9' }}>
          <Typography variant="h6" gutterBottom>
            Instructions
          </Typography>
          <Typography variant="body2" paragraph>
            1. Download the CSV template or prepare your own CSV file
          </Typography>
          <Typography variant="body2" paragraph>
            2. Fill in the required fields: <strong>name</strong>, <strong>email</strong>
          </Typography>
          <Typography variant="body2" paragraph>
            3. Optional fields: <strong>role</strong> (default: "Volunteer"), <strong>type</strong> (volunteer or speaker, default: "volunteer")
          </Typography>
          <Typography variant="body2" paragraph>
            4. Upload the file using the button above
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Note: Existing volunteers will be updated, new ones will be created
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};
