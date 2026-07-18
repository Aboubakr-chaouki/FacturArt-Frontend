import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080/api';
export const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://127.0.0.1:8080';

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
    const fullUrl = config.baseURL ? `${config.baseURL}${config.url}` : config.url;
    console.log("[DEBUG API] ====== Request Start ======");
    console.log("[DEBUG API] Method:", config.method?.toUpperCase());
    console.log("[DEBUG API] Full URL:", fullUrl);
    console.log("[DEBUG API] Token exists:", !!token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("[DEBUG API] ✓ Authorization Header added");
      
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log("[DEBUG API] Token Payload:", payload);
        console.log("[DEBUG API] Token Roles:", payload.roles);
        console.log("[DEBUG API] Token Expiration:", new Date(payload.exp * 1000).toLocaleString());
      } catch {
        console.error("[DEBUG API] Could not decode token payload");
      }
    } else {
      console.warn("[DEBUG API] ⚠ No token found in localStorage");
    }
    return config;
  },
  (error) => {
    console.error("[ERROR API] Erreur dans l'intercepteur de requête:", error);
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
api.interceptors.response.use(
  (response) => {
    console.log("[DEBUG API] ✓ Réponse reçue:", response.status, response.config.url);
    return response;
  },
  (error) => {
    if (!error.response) {
      console.error("[ERROR API] 🌐 Erreur Réseau (Serveur non joignable) :", error.message);
      console.error("[DEBUG] Vérifiez que votre backend Spring Boot est lancé sur", BASE_URL);
    } else {
      console.error("[ERROR API] Erreur API:", error.response?.status, error.config.url);
      if (error.response?.data) {
        console.error("[ERROR API] Détails:", error.response.data);
      }
    }

    if (error.response?.status === 403 || error.response?.status === 401) {
      console.error("[ERROR API] ❌ Authentification échouée (403/401) pour", error.config.url);
      console.error("[DEBUG] Détails:", error.response?.data);
      
      // Ne pas rediriger si on est sur une route publique
      const isPublicRoute = window.location.pathname.startsWith('/public');
      
      if (!isPublicRoute) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        console.warn("[ERROR API] Token supprimé du localStorage");
        
        // Rediriger vers login si on n'y est pas déjà
        if (!window.location.pathname.includes('/login')) {
          console.warn("[ERROR API] Redirection vers /login...");
          window.location.href = '/login';
        }
      } else {
        console.warn("[ERROR API] Erreur sur route publique, pas de redirection automatique.");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
