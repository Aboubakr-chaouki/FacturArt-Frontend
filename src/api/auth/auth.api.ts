import api from '../api.config';
import { LoginFormValues } from '../../lib/configs/schemas-zod/form/login-form-schema';
import { Step1Values, Step2Values } from '../../lib/configs/schemas-zod/form/register-form-schema';

export const authApi = {
  register: async (data: Step1Values & Step2Values) => {
    const formData = new FormData();
    
    // On sépare le logo (File) du reste des données (JSON)
    const { logo, ...rest } = data;
    
    // Création d'un Blob pour les données JSON de l'utilisateur
    const userDataBlob = new Blob([JSON.stringify(rest)], {
      type: 'application/json'
    });
    
    formData.append('userData', userDataBlob);
    
    if (logo instanceof File) {
      formData.append('logoFile', logo);
    }
    
    const response = await api.post('/auth/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  login: async (data: LoginFormValues) => {
    const response = await api.post('/auth/login', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  confirm: async (email: string, code: string) => {
    const response = await api.post('/auth/confirm', { email, code });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};
