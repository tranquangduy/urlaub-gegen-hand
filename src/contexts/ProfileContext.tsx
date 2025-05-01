'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { Profile } from '@/types';
import { api } from '@/mocks/api';
import { useAuth } from './AuthContext';
import { calculateProfileCompletion } from '@/lib/utils';

// Profile state interface
export interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  completionPercentage: number;
}

// Profile context interface
export interface ProfileContextType extends ProfileState {
  updateProfile: (data: Partial<Profile>) => Promise<boolean>;
  clearError: () => void;
  createProfile: (data: Partial<Profile>) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

// Default state
const defaultProfileState: ProfileState = {
  profile: null,
  isLoading: true,
  error: null,
  completionPercentage: 0,
};

// Create the context
export const ProfileContext = createContext<ProfileContextType>({
  ...defaultProfileState,
  updateProfile: async () => false,
  clearError: () => {},
  createProfile: async () => false,
  refreshProfile: async () => {},
});

// Profile provider props type
interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider = ({ children }: ProfileProviderProps) => {
  // Get auth context to access user details
  const { user, isAuthenticated } = useAuth();

  // Profile state
  const [profileState, setProfileState] =
    useState<ProfileState>(defaultProfileState);

  // Clear any error message
  const clearError = () => {
    setProfileState((prev) => ({ ...prev, error: null }));
  };

  // Fetch user profile on auth change
  useEffect(() => {
    const fetchUserProfile = async () => {
      // Skip if not authenticated or no user
      if (!isAuthenticated || !user) {
        setProfileState({
          ...defaultProfileState,
          isLoading: false,
        });
        return;
      }

      try {
        setProfileState((prev) => ({ ...prev, isLoading: true }));

        // Try to get the user's profile
        if (user.profileId) {
          const response = await api.getProfile(user.profileId);

          if (response.success && response.data) {
            const completion = calculateProfileCompletion(
              response.data,
              user.roles
            );

            setProfileState({
              profile: response.data,
              isLoading: false,
              error: null,
              completionPercentage: completion,
            });
          } else {
            setProfileState({
              profile: null,
              isLoading: false,
              error: 'Failed to load profile',
              completionPercentage: 0,
            });
          }
        } else {
          // User doesn't have a profile yet
          setProfileState({
            profile: null,
            isLoading: false,
            error: null,
            completionPercentage: 0,
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setProfileState({
          profile: null,
          isLoading: false,
          error: 'Failed to fetch profile',
          completionPercentage: 0,
        });
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, user]);

  // Refresh profile data
  const refreshProfile = async () => {
    if (!user?.profileId) return;

    try {
      setProfileState((prev) => ({ ...prev, isLoading: true }));
      const response = await api.getProfile(user.profileId);

      if (response.success && response.data) {
        const completion = calculateProfileCompletion(
          response.data,
          user.roles
        );

        setProfileState({
          profile: response.data,
          isLoading: false,
          error: null,
          completionPercentage: completion,
        });
      } else {
        setProfileState((prev) => ({
          ...prev,
          isLoading: false,
          error: 'Failed to refresh profile',
        }));
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error);
      setProfileState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to refresh profile',
      }));
    }
  };

  // Create a new profile
  const createProfile = async (data: Partial<Profile>): Promise<boolean> => {
    if (!user) return false;

    try {
      setProfileState((prev) => ({ ...prev, isLoading: true }));
      const response = await api.createProfile(user.id, data);

      if (response.success && response.data) {
        const completion = calculateProfileCompletion(
          response.data,
          user.roles
        );

        setProfileState({
          profile: response.data,
          isLoading: false,
          error: null,
          completionPercentage: completion,
        });
        return true;
      } else {
        setProfileState((prev) => ({
          ...prev,
          isLoading: false,
          error: 'Failed to create profile',
        }));
        return false;
      }
    } catch (error) {
      console.error('Failed to create profile:', error);
      setProfileState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to create profile',
      }));
      return false;
    }
  };

  // Update profile data
  const updateProfile = async (data: Partial<Profile>): Promise<boolean> => {
    if (!profileState.profile?.id) return false;

    try {
      setProfileState((prev) => ({ ...prev, isLoading: true }));
      const response = await api.updateProfile(profileState.profile.id, data);

      if (response.success && response.data) {
        const completion = calculateProfileCompletion(
          response.data,
          user?.roles || []
        );

        setProfileState({
          profile: response.data,
          isLoading: false,
          error: null,
          completionPercentage: completion,
        });
        return true;
      } else {
        setProfileState((prev) => ({
          ...prev,
          isLoading: false,
          error: 'Failed to update profile',
        }));
        return false;
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      setProfileState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to update profile',
      }));
      return false;
    }
  };

  // Provide the context value
  const value = {
    ...profileState,
    updateProfile,
    clearError,
    createProfile,
    refreshProfile,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};

// Custom hook to use the profile context
export const useProfile = () => useContext(ProfileContext);
