import axios from 'axios';
import { auth } from '../firebase';

const baseURL =
  (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "") ||
  "http://localhost:5000";

export const api = axios.create({
  baseURL,
});


api.interceptors.request.use(async (config) => {
  if (auth) {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
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