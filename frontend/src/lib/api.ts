import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Keep track of if we're already redirecting to prevent multiple redirects
let isRedirecting = false;

// Add a request interceptor to add the auth token
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !isRedirecting) {
      // Handle unauthorized access
      isRedirecting = true;
      console.log('Unauthorized access, redirecting to login');
      Cookies.remove('token');
      Cookies.remove('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default api;
