import api from './axios';

const authService = {
  register: async (email, password, name, major) => {
    const response = await api.post('/api/auth/register', { email, password, name, major });
    return response.data; // Expected response: { token, user: { id, email, name, major } }
  },

login: async (email, password) => {
  const res = await api.post('/api/auth/login', { email, password });

  console.log("LOGIN RESPONSE:", res.data);

  const { token, user } = res.data;

  if (!token) {
    console.error("NO TOKEN RECEIVED FROM BACKEND");
    return;
  }

  localStorage.setItem("campus_event_hub_token", token);
  localStorage.setItem("campus_event_hub_user", JSON.stringify(user));

  return res.data;
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
