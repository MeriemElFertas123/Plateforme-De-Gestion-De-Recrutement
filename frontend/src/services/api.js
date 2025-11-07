import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('📤 Requête:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Erreur requête:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('📥 Réponse:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('❌ Erreur réponse:', error.response?.status, error.message);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;