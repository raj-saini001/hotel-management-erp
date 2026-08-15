import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hotel_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('hotel_admin_token');
      localStorage.removeItem('hotel_admin_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Async delay helper to simulate realistic network latency
export const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export default api;
