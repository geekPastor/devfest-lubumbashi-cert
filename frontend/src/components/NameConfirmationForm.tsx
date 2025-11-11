import React from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { useForm } from 'react-hook-form';

interface NameConfirmationProps {
  defaultName: string;
  onSubmit: (name: string) => Promise<void>;
}

interface FormData {
  name: string;
}

export const NameConfirmationForm: React.FC<NameConfirmationProps> = ({ 
  defaultName, 
  onSubmit 
}) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: {
      name: defaultName
    }
  });

  const onFormSubmit = async (data: FormData) => {
    try {
      await onSubmit(data.name);
    } catch (error) {
      console.error('Error submitting name:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onFormSubmit)} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Confirm Your Name
      </Typography>

      <Typography variant="body1" color="text.secondary" gutterBottom>
        Please confirm or edit your name as it will appear on the certificate
      </Typography>
      
      <TextField
        {...register('name', {
          required: 'Name is required',
          maxLength: {
            value: 50,
            message: 'Name must be 50 characters or less'
          }
        })}
        fullWidth
        label="Full Name"
        margin="normal"
        error={!!errors.name}
        helperText={errors.name?.message}
      />

      {errors.name && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errors.name.message}
        </Alert>
      )}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Generating Certificate...' : 'Confirm & Generate Certificate'}
      </Button>
    </Box>
  );
};