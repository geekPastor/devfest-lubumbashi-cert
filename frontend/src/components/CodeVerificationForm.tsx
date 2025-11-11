import React from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { useForm } from 'react-hook-form';

interface CodeVerificationProps {
  onSubmit: (code: string) => Promise<void>;
  onResendCode: () => Promise<void>;
  email: string;
}

interface FormData {
  code: string;
}

export const CodeVerificationForm: React.FC<CodeVerificationProps> = ({ 
  onSubmit, 
  onResendCode, 
  email 
}) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();

  const onFormSubmit = async (data: FormData) => {
    try {
      await onSubmit(data.code);
    } catch (error) {
      console.error('Error submitting code:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onFormSubmit)} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Enter Verification Code
      </Typography>

      <Typography variant="body1" color="text.secondary" gutterBottom>
        We've sent a verification code to {email}
      </Typography>
      
      <TextField
        {...register('code', {
          required: 'Verification code is required',
          minLength: {
            value: 6,
            message: 'Code must be 6 digits'
          },
          maxLength: {
            value: 6,
            message: 'Code must be 6 digits'
          },
          pattern: {
            value: /^[0-9]{6}$/,
            message: 'Code must be 6 digits'
          }
        })}
        fullWidth
        label="Verification Code"
        margin="normal"
        error={!!errors.code}
        helperText={errors.code?.message}
      />

      {errors.code && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errors.code.message}
        </Alert>
      )}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3 }}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Verifying...' : 'Verify Code'}
      </Button>

      <Button
        type="button"
        fullWidth
        variant="text"
        onClick={() => onResendCode()}
        sx={{ mt: 1 }}
      >
        Resend Code
      </Button>
    </Box>
  );
};