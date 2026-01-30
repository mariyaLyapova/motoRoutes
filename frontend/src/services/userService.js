import api from './api';

export const userService = {
  // Get all users
  getUsers: () =>
    api.get('/users/'),

  // Get user by ID
  getUser: (id) =>
    api.get(`/users/${id}/`),

  // Get current user's profile (requires auth)
  getProfile: () =>
    api.get('/users/profile/'),

  // Update current user's profile (requires auth)
  updateProfile: (userData) =>
    api.patch('/users/profile/', userData),
};
