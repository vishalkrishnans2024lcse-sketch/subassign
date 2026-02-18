import axios from 'axios';
import { mockAuthAPI, mockAssignmentAPI, mockSubmissionAPI } from './mockApi';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const USE_MOCK_API = true; // Set to false when backend is ready

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = USE_MOCK_API ? mockAuthAPI : {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const assignmentAPI = USE_MOCK_API ? mockAssignmentAPI : {
  getAll: () => api.get('/assignments'),
  create: (data) => api.post('/assignments', data),
  update: (id, data) => api.put(`/assignments/${id}`, data),
  delete: (id) => api.delete(`/assignments/${id}`),
};

export const submissionAPI = USE_MOCK_API ? mockSubmissionAPI : {
  getAll: () => api.get('/submissions'),
  getByAssignment: (assignmentId) => api.get(`/submissions/assignment/${assignmentId}`),
  create: (data) => api.post('/submissions', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  grade: (id, data) => api.put(`/submissions/${id}/grade`, data),
};

export default api;