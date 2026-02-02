import { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';

// Create the context
export const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component to wrap the app
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      // Token exists, fetch user profile
      authService
        .getProfile()
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error('Failed to fetch profile:', error);
          // Token is invalid, clear storage
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // No token, user is not logged in
      setLoading(false);
    }
  }, []);

  // Login function
  const login = async (username, password) => {
    try {
      // Get JWT tokens
      const response = await authService.login(username, password);
      const { access, refresh } = response.data;

      // Store tokens in localStorage
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

      // Fetch user profile
      const profileResponse = await authService.getProfile();
      setUser(profileResponse.data);

      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Login failed',
      };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      // Register new user
      await authService.register(userData);

      // Automatically login after registration
      const loginResult = await login(userData.username, userData.password);
      return loginResult;
    } catch (error) {
      console.error('Registration failed:', error);
      return {
        success: false,
        error: error.response?.data || 'Registration failed',
      };
    }
  };

  // Logout function
  const logout = () => {
    // Clear tokens from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    // Clear user state
    setUser(null);
  };

  // Update user profile
  const updateUser = async (userData) => {
    try {
      const response = await authService.updateProfile(userData);
      setUser(response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Profile update failed:', error);
      return {
        success: false,
        error: error.response?.data || 'Update failed',
      };
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return user !== null;
  };

  // Context value
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
