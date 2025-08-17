import axios from 'axios';

const API_BASE_URL = 'https://summarizerapi-h9tg.onrender.com/api' || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const summaryAPI = {
  generateSummary: async (data) => {
    const res = await api.post('/summary/generate', data);
    return res.data;
  },
  getAllSummaries: async () => (await api.get('/summary')).data,
  getSummary: async (id) => (await api.get(`/summary/${id}`)).data,
  updateSummary: async (id, data) => (await api.put(`/summary/${id}`, data)).data,
  deleteSummary: async (id) => (await api.delete(`/summary/${id}`)).data,
  shareSummary: async (id, emails) => (await api.post(`/summary/${id}/share`, { emails })).data,
  getSharedSummary: async (token) => (await api.get(`/summary/shared/${token}`)).data,
};

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return (await api.post('/summary/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })).data;
};

export default api;
