import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import authService from '../api/authService';

const AuthContext = createContext(null);

const TOKEN_KEY = 'campus_event_hub_token';
const USER_KEY = 'campus_event_hub_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // -------------------------------
  // INIT AUTH (AUTO LOGIN)
  // -------------------------------
  useEffect(() => {
    async function initializeAuth() {
      const storedToken = localStorage.getItem(TOKEN_KEY);

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const authData = await authService.getMe();
        setUser(authData.user);

        const profileResponse = await api.get('/api/profile/me/profile');
        setProfile(profileResponse.data);
      } catch (error) {
        console.error('Session expired or invalid:', error);

        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem('token');

        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }

    initializeAuth();
  }, []);

  // -------------------------------
  // LOGIN
  // -------------------------------
  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      const { token, user: loggedUser } = data;

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem('token', token); // socket support
      localStorage.setItem(USER_KEY, JSON.stringify(loggedUser));

      setUser(loggedUser);

      const profileResponse = await api.get('/api/profile/me/profile');
      setProfile(profileResponse.data);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          'Invalid campus credentials. Please try again.'
      };
    }
  };

  // -------------------------------
  // REGISTER
  // -------------------------------
  const register = async (email, password, name, major) => {
    try {
      const data = await authService.register(email, password, name, major);
      const { token, user: registeredUser } = data;

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem('token', token);
      localStorage.setItem(USER_KEY, JSON.stringify(registeredUser));

      setUser(registeredUser);

      const profileResponse = await api.get('/api/profile/me/profile');
      setProfile(profileResponse.data);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          'Registration failed. Try again.'
      };
    }
  };

  // -------------------------------
  // LOGOUT
  // -------------------------------
  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn('Logout API error:', err);
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem('token');

      setUser(null);
      setProfile(null);
    }
  };

  // -------------------------------
  // REFRESH PROFILE
  // -------------------------------
  const refreshProfile = async () => {
    try {
      const response = await api.get('/api/profile/me/profile');
      setProfile(response.data);

      const updatedUser = {
        id: response.data.id,
        email: response.data.email,
        name: response.data.name,
        major: response.data.major
      };

      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Profile refresh failed:', error);
    }
  };

  // -------------------------------
  // UPDATE PROFILE
  // -------------------------------
  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/api/profile/update', profileData);

      await refreshProfile();

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Profile update failed.'
      };
    }
  };

  // -------------------------------
  // UPDATE SKILLS
  // -------------------------------
  const updateSkills = async (skills) => {
    try {
      const response = await api.put('/api/profile/skills', { skills });
      setProfile(response.data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Skills update failed.'
      };
    }
  };

  // -------------------------------
  // UPDATE INTERESTS
  // -------------------------------
  const updateInterests = async (interests) => {
    try {
      const response = await api.put('/api/profile/interests', { interests });
      setProfile(response.data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Interests update failed.'
      };
    }
  };

  // -------------------------------
  // CONTEXT VALUE
  // -------------------------------
  const value = {
    user,
    profile,
    loading,
    login,
    register,
    logout,
    refreshProfile,
    updateProfile,
    updateSkills,
    updateInterests
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be consumed inside an AuthProvider');
  }
  return context;
}