import api from './axios';

const profileService = {
  getOwnProfile: async () => {
    const response = await api.get('/api/profile/me/profile');
    return response.data;
  },

  getUserProfile: async (id) => {
    const response = await api.get(`/api/profile/${id}`);
    return response.data;
  },

 updateProfile: async (profileData) => {
  console.log("SENDING:", profileData);

  try {
    const response = await api.put('/api/profile/update', profileData);
    return response.data;
  } catch (error) {
    console.log("ERROR:", error.response?.data);
    throw error;
  }
},

  updateSkills: async (skills) => {
    const response = await api.put('/api/profile/skills', { skills });
    return response.data;
  },

  updateInterests: async (interests) => {
    const response = await api.put('/api/profile/interests', { interests });
    return response.data;
  },

  searchUsersBySkill: async (skill) => {
    const response = await api.get(`/api/profile/search/skills`, {
      params: { query: skill }
    });
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get('/api/profile/users/all');
    return response.data;
  }
};

export default profileService;
