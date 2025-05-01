'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { User, UserRole } from '@/types';
import { api } from '@/mocks/api';

// Authentication state interface
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Authentication context interface
export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    email: string,
    password: string,
    name: string,
    roles: UserRole[]
  ) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  updateUser: (userData: Partial<User>) => Promise<boolean>;
  verifyEmail: (verificationToken: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  setNewPassword: (token: string, newPassword: string) => Promise<boolean>;
  refreshSession: () => void;
}

// Default state for authentication
const defaultAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Create the authentication context
export const AuthContext = createContext<AuthContextType>({
  ...defaultAuthState,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  clearError: () => {},
  updateUser: async () => false,
  verifyEmail: async () => false,
  resetPassword: async () => false,
  setNewPassword: async () => false,
  refreshSession: () => {},
});

// Get localStorage keys
const AUTH_TOKEN_KEY = 'urlaub_auth_token';
const AUTH_EXPIRY_KEY = 'urlaub_auth_expiry';

// Session duration in milliseconds (1 hour)
const SESSION_DURATION = 60 * 60 * 1000;

// Authentication provider props type
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // State for authentication
  const [authState, setAuthState] = useState<AuthState>(defaultAuthState);

  // Clear any error message
  const clearError = () => {
    setAuthState((prev) => ({ ...prev, error: null }));
  };

  // Set auth token with expiry
  const setAuthToken = (token: string) => {
    if (typeof window === 'undefined') return;

    // Calculate expiry time
    const expiryTime = Date.now() + SESSION_DURATION;

    // Store token and expiry in localStorage
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_EXPIRY_KEY, expiryTime.toString());
  };

  // Check if session is expired
  const isSessionExpired = (): boolean => {
    if (typeof window === 'undefined') return true;

    const expiryTime = localStorage.getItem(AUTH_EXPIRY_KEY);
    if (!expiryTime) return true;

    return parseInt(expiryTime, 10) < Date.now();
  };

  // Refresh session by extending expiry time
  const refreshSession = useCallback(() => {
    if (typeof window === 'undefined' || !authState.isAuthenticated) return;

    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return;

    // Set new expiry time
    const expiryTime = Date.now() + SESSION_DURATION;
    localStorage.setItem(AUTH_EXPIRY_KEY, expiryTime.toString());
  }, [authState.isAuthenticated]);

  // Logout function
  const logout = useCallback(() => {
    // Remove token from localStorage
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_EXPIRY_KEY);

    // Reset auth state
    setAuthState({
      ...defaultAuthState,
      isLoading: false,
    });
  }, []);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Skip in SSR
        if (typeof window === 'undefined') return;

        const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);

        if (!storedToken || isSessionExpired()) {
          // Token doesn't exist or is expired
          localStorage.removeItem(AUTH_TOKEN_KEY);
          localStorage.removeItem(AUTH_EXPIRY_KEY);
          setAuthState((prev) => ({ ...prev, isLoading: false }));
          return;
        }

        // Attempt to get the current user with the token
        const response = await api.getCurrentUser(storedToken);

        if (response.success && response.data) {
          setAuthState({
            user: response.data,
            token: storedToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          // Refresh the session since we've confirmed it's valid
          refreshSession();
        } else {
          // Token is invalid, remove it
          localStorage.removeItem(AUTH_TOKEN_KEY);
          localStorage.removeItem(AUTH_EXPIRY_KEY);
          setAuthState({ ...defaultAuthState, isLoading: false });
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        setAuthState({
          ...defaultAuthState,
          isLoading: false,
          error: 'Failed to restore session',
        });
      }
    };

    initializeAuth();
  }, [refreshSession]);

  // Check for session timeout periodically
  useEffect(() => {
    if (!authState.isAuthenticated) return;

    const checkSessionTimeout = () => {
      if (isSessionExpired()) {
        console.log('Session expired, logging out...');
        logout();
      }
    };

    // Check every minute
    const interval = setInterval(checkSessionTimeout, 60 * 1000);

    // Clean up on unmount
    return () => clearInterval(interval);
  }, [authState.isAuthenticated, logout]);

  // Add event listeners to refresh session on user activity
  useEffect(() => {
    if (!authState.isAuthenticated) return;

    const handleUserActivity = () => {
      refreshSession();
    };

    // Refresh session on user interaction
    window.addEventListener('click', handleUserActivity);
    window.addEventListener('keypress', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity, { passive: true });

    // Clean up on unmount
    return () => {
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('keypress', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
    };
  }, [authState.isAuthenticated, refreshSession]);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await api.login(email, password);

      if (response.success && response.data) {
        const { user, token } = response.data;

        // Store token in localStorage with expiry
        setAuthToken(token);

        // Update auth state
        setAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        return true;
      } else {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: response.error || 'Login failed',
        }));

        return false;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Login failed';

      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      return false;
    }
  };

  // Register function
  const register = async (
    email: string,
    password: string,
    name: string,
    roles: UserRole[]
  ): Promise<boolean> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await api.register(email, password, name, roles);

      if (response.success && response.data) {
        const { user, token } = response.data;

        // Store token in localStorage with expiry
        setAuthToken(token);

        // Update auth state
        setAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        return true;
      } else {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: response.error || 'Registration failed',
        }));

        return false;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Registration failed';

      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      return false;
    }
  };

  // Update user function (for profile updates)
  const updateUser = async (userData: Partial<User>): Promise<boolean> => {
    try {
      if (!authState.user || !authState.token) {
        setAuthState((prev) => ({
          ...prev,
          error: 'You must be logged in to update your profile',
        }));
        return false;
      }

      // In a real app, we would call an API to update the user
      // For our mock app, we'll just update the state directly
      setAuthState((prev) => ({
        ...prev,
        user: { ...prev.user!, ...userData },
      }));

      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update profile';

      setAuthState((prev) => ({
        ...prev,
        error: errorMessage,
      }));

      return false;
    }
  };

  // Email verification function (mocked)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const verifyEmail = async (_verificationToken: string): Promise<boolean> => {
    try {
      if (!authState.user) {
        setAuthState((prev) => ({
          ...prev,
          error: 'You must be logged in to verify your email',
        }));
        return false;
      }

      // In a real app, we would call an API to verify the email
      // For our mock app, we'll just update the state directly
      setAuthState((prev) => ({
        ...prev,
        user: {
          ...prev.user!,
          emailVerified: new Date(),
        },
      }));

      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to verify email';

      setAuthState((prev) => ({
        ...prev,
        error: errorMessage,
      }));

      return false;
    }
  };

  // Reset password function (mocked)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const resetPassword = async (_email: string): Promise<boolean> => {
    try {
      // In a real app, we would call an API to send a reset email
      // For our mock app, we'll just return success
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to reset password';

      setAuthState((prev) => ({
        ...prev,
        error: errorMessage,
      }));

      return false;
    }
  };

  // Set new password function (mocked)
  const setNewPassword = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _token: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _newPassword: string
  ): Promise<boolean> => {
    try {
      // In a real app, we would call an API to set the new password
      // For our mock app, we'll just return success
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to set new password';

      setAuthState((prev) => ({
        ...prev,
        error: errorMessage,
      }));

      return false;
    }
  };

  // Provide the authentication context
  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        clearError,
        updateUser,
        verifyEmail,
        resetPassword,
        setNewPassword,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the authentication context
export const useAuth = () => useContext(AuthContext);
