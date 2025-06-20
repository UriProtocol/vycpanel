// services/auth.js
import api from '../lib/api';

export const AuthService = {
  async login(credentials) {
    const response = await api.post('/login', credentials);
    console.log(response)
    // Store token in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', response.data.token);
    }
    return response.data.user;
  },

  async logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    // Optional: Call your backend logout endpoint
    //await api.post('/logout');
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};