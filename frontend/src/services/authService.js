import api from './api';

export const authService = {
  // Login - get JWT tokens
  login: (username, password) =>
    api.post('/auth/token/', { username, password }),

  // Register new user
  register: (userData) =>
    api.post('/users/register/', userData),

  // Get current user profile (requires auth)
  getProfile: () =>
    api.get('/users/profile/'),

  // Update user profile (requires auth)
  updateProfile: (userData) =>
    api.patch('/users/profile/', userData),

  // Refresh JWT token
  refreshToken: (refreshToken) =>
    api.post('/auth/token/refresh/', { refresh: refreshToken }),
};
