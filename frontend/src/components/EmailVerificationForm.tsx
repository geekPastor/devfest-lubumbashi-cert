import React from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { useForm } from 'react-hook-form';

interface EmailFormProps {
  onSubmit: (email: string) => Promise<void>;
}

interface FormData {
  email: string;
}

export const EmailVerificationForm: React.FC<EmailFormProps> = ({ onSubmit }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();

  const onFormSubmit = async (data: FormData) => {
    try {
      await onSubmit(data.email);
    } catch (error) {
      console.error('Error submitting email:', error);
      const errorMessage =
        (error as any)?.response?.data?.error ||
        (error instanceof Error ? error.message : 'Failed to verify email. Please try again.');
      alert(errorMessage); // This will help us see the error message
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onFormSubmit)} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Get Your Certificate
      </Typography>
      
      <TextField
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address'
          }
        })}
        fullWidth
        label="Email Address"
        margin="normal"
        error={!!errors.email}
        helperText={errors.email?.message}
      />

      {errors.email && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errors.email.message}
        </Alert>
      )}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Verifying...' : 'Get Certificate'}
      </Button>
    </Box>
  );
};