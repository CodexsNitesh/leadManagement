import axios from 'axios';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const baseURL = rawBaseUrl.replace(/\/$/, '').endsWith('/api')
  ? rawBaseUrl.replace(/\/$/, '')
  : `${rawBaseUrl.replace(/\/$/, '')}/api`;

const api = axios.create({
  baseURL,
  timeout: 20000,
});

export const createLead = async (payload) => {
  const { data } = await api.post('/leads', payload);
  return data.data;
};

export const getAnalytics = async () => {
  const { data } = await api.get('/analytics');
  return data.data;
};

export const getLeads = async () => {
  const { data } = await api.get('/leads');
  return data.data;
};

export default api;
