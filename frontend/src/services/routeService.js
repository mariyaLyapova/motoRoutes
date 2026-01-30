import api from './api';

export const routeService = {
  // Get all routes (paginated, lightweight)
  getRoutes: (page = 1, filters = {}) => {
    const params = new URLSearchParams({ page, ...filters });
    return api.get(`/routes/?${params}`);
  },

  // Get single route with full details (locations, images, comments)
  getRoute: (id) =>
    api.get(`/routes/${id}/`),

  // Create new route (requires auth)
  createRoute: (routeData) =>
    api.post('/routes/', routeData),

  // Update route (requires auth, creator only)
  updateRoute: (id, routeData) =>
    api.patch(`/routes/${id}/`, routeData),

  // Delete route (requires auth, creator only)
  deleteRoute: (id) =>
    api.delete(`/routes/${id}/`),

  // Get routes by specific user
  getUserRoutes: (userId) =>
    api.get(`/routes/user/${userId}/`),

  // Get locations for a route
  getRouteLocations: (routeId) =>
    api.get(`/routes/${routeId}/locations/`),

  // Get comments for a route
  getRouteComments: (routeId) =>
    api.get(`/routes/${routeId}/comments/`),
};
