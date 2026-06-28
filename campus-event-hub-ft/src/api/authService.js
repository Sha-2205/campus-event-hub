import api from './axios';

const authService = {
  register: async (email, password, name, major) => {
    const response = await api.post('/api/auth/register', { email, password, name, major });
    return response.data; // Expected response: { token, user: { id, email, name, major } }
  },

  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data; // Expected response: { token, user: { id, email, name, major } }
  },

  logout: async () => {
    const response = await api.post('/api/auth/logout');
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/api/auth/me');
    return response.data; // Expected response: { user: { id, email, name, major } }
  }
};

export default authService;
