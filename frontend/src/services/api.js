import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Summary API calls
export const summaryAPI = {
  // Generate new summary
  generateSummary: async (data) => {
    const response = await api.post('/summary/generate', data);
    return response.data;
  },

  // Get all summaries
  getAllSummaries: async () => {
    const response = await api.get('/summary');
    return response.data;
  },

  // Get single summary
  getSummary: async (id) => {
    const response = await api.get(`/summary/${id}`);
    return response.data;
  },

  // Update summary
  updateSummary: async (id, data) => {
    const response = await api.put(`/summary/${id}`, data);
    return response.data;
  },

  // Delete summary
  deleteSummary: async (id) => {
    const response = await api.delete(`/summary/${id}`);
    return response.data;
  },

  // Share summary
  shareSummary: async (id, emails) => {
    const response = await api.post(`/summary/${id}/share`, { emails });
    return response.data;
  },

  // Get shared summary
  getSharedSummary: async (token) => {
    const response = await api.get(`/summary/shared/${token}`);
    return response.data;
  },
};

// File upload
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/summary/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export default api;
