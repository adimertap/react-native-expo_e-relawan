import axios from 'axios';
import { API_URL } from '../constants/env';

const api = axios.create({
  baseURL: API_URL || 'http://localhost:5050', // Adjust this to your API URL
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration
      localStorage.removeItem('token');
      // You might want to redirect to login page here
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 