import api from './axios';

const authService = {
  register: async (email, password, name, major) => {
    const response = await api.post('/api/auth/register', { email, password, name, major });
    return response.data; // Expected response: { token, user: { id, email, name, major } }
  },

  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });

    const { token, user } = response.data;

    // SAVE TOKEN HERE (THIS IS THE MISSING PART)
    localStorage.setItem("campus_event_hub_token", token);
    localStorage.setItem("campus_event_hub_user", JSON.stringify(user));

    return response.data;
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
