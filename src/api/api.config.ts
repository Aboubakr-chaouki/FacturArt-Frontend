import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080/api';
const API_URL = rawApiUrl;
export const BASE_URL = rawApiUrl.replace('/api', '');

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        if (import.meta.env.DEV) {
            console.error("[API Request Error]", error);
        }
        return Promise.reject(error);
    }
);

// Intercepteur pour les réponses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response) {
            if (import.meta.env.DEV) {
                console.error("[API Network Error] Server unreachable:", error.message);
            }
        } else if (import.meta.env.DEV) {
            console.error(`[API Error] ${error.response?.status} for ${error.config.url}`, error.response?.data);
        }

        if (error.response?.status === 403 || error.response?.status === 401) {
            // Ne pas rediriger si on est sur une route publique
            const isPublicRoute = window.location.pathname.startsWith('/public');

            if (!isPublicRoute) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');

                // Rediriger vers login si on n'y est pas déjà
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;