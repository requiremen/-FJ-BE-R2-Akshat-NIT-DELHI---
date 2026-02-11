import axios from 'axios';

// Ensure baseURL doesn't have a trailing slash
const baseURL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, "");

const api = axios.create({
  baseURL: baseURL,
});

// Debug: Log the API URL being used
console.log('API URL:', api.defaults.baseURL);

// Add a request interceptor to add the token to headers
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

export default api;
