import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const verifyEmail = async (email: string) => {
  try {
    const response = await api.post('/api/verify/email', { email });
    return response.data;
  } catch (error: any) {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
};

export const verifyCode = async (email: string, code: string) => {
  const response = await api.post('/api/verify/code', { email, code });
  return response.data;
};

export const generateCertificate = async (email: string, name: string) => {
  const response = await api.post('/api/certificates/generate', { email, name });
  console.log('Generate Certificate Response:', response.data);
  return response.data; // This already returns { success, data, alreadyExists? }
};

export const verifyCertificate = async (certificateId: string) => {
  const response = await api.get(`/api/certificates/verify/${certificateId}`);
  return response.data.data; // Return the nested data object
};

export const shareToLinkedIn = async (certificateId: string) => {
  const response = await api.post(`/api/certificates/${certificateId}/share/linkedin`);
  return response.data;
};