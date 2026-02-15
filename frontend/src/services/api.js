import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.1.136:5000/api',
});

// Middleware pour ajouter le token de sécurité
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
});

export default api;
