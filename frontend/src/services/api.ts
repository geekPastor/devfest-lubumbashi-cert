import axios from "axios";
import { auth } from "../firebase";

const raw = (import.meta.env.VITE_API_URL || "").trim();
const baseURL = raw ? raw.replace(/\/+$/, "") : ""; // "" => same-origin

export const api = axios.create({
  baseURL,
  // withCredentials: true, // active seulement si tu utilises cookies/sessions
});

api.interceptors.request.use(async (config) => {
  const user = auth?.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const verifyEmail = async (email: string) => {
  const { data } = await api.post("/api/verify/email", { email });
  return data;
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