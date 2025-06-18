// axios.ts

import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3001',
});

// Intercepteur pour gérer le token expiré
instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.data?.error === 'Token expiré') {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance; // ✅ exporte l’instance personnalisée
