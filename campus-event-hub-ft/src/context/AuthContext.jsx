import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import authService from '../api/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize: Auto-Login check & session restoration
  useEffect(() => {
    async function initializeAuth() {
      const storedToken = localStorage.getItem('campus_event_hub_token');
      const storedUser = localStorage.getItem('campus_event_hub_user');

      if (storedToken) {
        try {
          // Verify session integrity with the /api/auth/me endpoint
          const authData = await authService.getMe();
          setUser(authData.user);

          // Get the full profile details from profile endpoints
          const profileResponse = await api.get('/api/profile/me/profile');
          setProfile(profileResponse.data);
        } catch (error) {
          console.error("Auto-login session expired or invalid:", error);
          // If token or session expired, clear stored credentials gracefully
          localStorage.removeItem('campus_event_hub_token');
          localStorage.removeItem('campus_event_hub_user');
          setUser(null);
          setProfile(null);
        }
      } else if (storedUser) {
        // Fallback or cleanup if user cached but no token
        localStorage.removeItem('campus_event_hub_user');
      }
      setLoading(false);
    }
    initializeAuth();
  }, []);

  // Login handler utilizing authService
  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      const { token, user: loggedUser } = data;

      // Persist token & user profile in Local Storage (Remember Session)
     localStorage.setItem('campus_event_hub_token', token);
localStorage.setItem('token', token); // Added for Socket.IO
localStorage.setItem(
  'campus_event_hub_user',
  JSON.stringify(loggedUser)
);
      setUser(loggedUser);

      // Fetch active student profile details
      const profileResponse = await api.get('/api/profile/me/profile');
      setProfile(profileResponse.data);

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid campus credentials. Please try again.';
      return { success: false, error: message };
    }
  };

  // Registration handler utilizing authService
  const register = async (email, password, name, major) => {
    try {
      const data = await authService.register(email, password, name, major);
      const { token, user: registeredUser } = data;

      // Persist session details
      localStorage.setItem('campus_event_hub_token', token);
localStorage.setItem('token', token); // Added for Socket.IO
localStorage.setItem(
  'campus_event_hub_user',
  JSON.stringify(registeredUser)
);

      setUser(registeredUser);

      // Fetch newly created profile details
      const profileResponse = await api.get('/api/profile/me/profile');
      setProfile(profileResponse.data);

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Try again.';
      return { success: false, error: message };
    }
  };

  // Logout handler utilizing authService
  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn("API logout alert:", err);
    } finally {
      // Clear all state and local storage keys (Remember Session end)
      localStorage.removeItem('campus_event_hub_token');
localStorage.removeItem('campus_event_hub_user');
localStorage.removeItem('token'); // Remove Socket.IO token too
      setUser(null);
      setProfile(null);
    }
  };

  // Helper: Refresh profile details (bio, major, skills, interests)
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
      localStorage.setItem('campus_event_hub_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error("Error refreshing active profile details:", error);
    }
  };

  // Helper: Update basic fields
  const updateProfile = async (profileData) => {
  try {
    console.log("PROFILE DATA SENT:", profileData);

    const response = await api.put('/api/profile/update', profileData);

    console.log("SERVER RESPONSE:", response.data);

    await refreshProfile();

    return { success: true, data: response.data };

  } catch (error) {
    console.log("FULL ERROR:", error.response);
    console.log("ERROR DATA:", error.response?.data);

    return {
      success: false,
      error: error.response?.data?.message || 'Profile update failed.'
    };
  }
};
  // Helper: Update skills tags
  const updateSkills = async (skills) => {
    try {
      const response = await api.put('/api/profile/skills', { skills });
      setProfile(response.data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Skills update failed.' };
    }
  };

  // Helper: Update interests tags
  const updateInterests = async (interests) => {
    try {
      const response = await api.put('/api/profile/interests', { interests });
      setProfile(response.data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Interests update failed.' };
    }
  };

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
