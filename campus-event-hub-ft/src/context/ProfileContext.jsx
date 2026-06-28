import React, { createContext, useContext, useState, useEffect } from 'react';
import profileService from '../api/profileService';
import { useAuth } from './AuthContext';
import { useApp } from './AppContext';

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const { user, refreshProfile: refreshAuthProfile } = useAuth();
  const { showToast } = useApp();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // Sync profile when user changes
  useEffect(() => {
    if (user) {
      loadOwnProfile();
    } else {
      setProfile(null);
    }
  }, [user]);

  const loadOwnProfile = async () => {
    try {
      setLoading(true);
      const data = await profileService.getOwnProfile();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching own profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfileData = async (profileData) => {
    try {
      setLoading(true);
      const updated = await profileService.updateProfile(profileData);
      setProfile(updated);
      await refreshAuthProfile(); // keep AuthContext in sync
      return { success: true, data: updated };
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update profile.';
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const updateProfileSkills = async (skills) => {
    try {
      setLoading(true);
      const updated = await profileService.updateSkills(skills);
      setProfile(updated);
      await refreshAuthProfile();
      return { success: true, data: updated };
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update skills.';
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const updateProfileInterests = async (interests) => {
    try {
      setLoading(true);
      const updated = await profileService.updateInterests(interests);
      setProfile(updated);
      await refreshAuthProfile();
      return { success: true, data: updated };
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update interests.';
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      setUsersLoading(true);
      const data = await profileService.getAllUsers();
      setAllUsers(data);
      return data;
    } catch (error) {
      console.error('Error fetching all student records:', error);
      showToast('Could not fetch student directory.', 'error');
      return [];
    } finally {
      setUsersLoading(false);
    }
  };

  const searchUsersBySkill = async (skillQuery) => {
    try {
      setUsersLoading(true);
      const data = await profileService.searchUsersBySkill(skillQuery);
      return data;
    } catch (error) {
      console.error('Error searching users by skill:', error);
      return [];
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchUserProfile = async (id) => {
    try {
      const data = await profileService.getUserProfile(id);
      return data;
    } catch (error) {
      console.error(`Error fetching user profile for ${id}:`, error);
      return null;
    }
  };

  const value = {
    profile,
    loading,
    allUsers,
    usersLoading,
    loadOwnProfile,
    updateProfile: updateProfileData,
    updateSkills: updateProfileSkills,
    updateInterests: updateProfileInterests,
    fetchAllUsers,
    searchUsersBySkill,
    fetchUserProfile
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be inside a ProfileProvider');
  }
  return context;
}
