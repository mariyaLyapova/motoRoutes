import api from './api';

export const locationService = {
  // Get all locations
  getLocations: () =>
    api.get('/routes/locations/'),

  // Get single location details
  getLocation: (id) =>
    api.get(`/routes/locations/${id}/`),

  // Create new location/POI (requires auth)
  createLocation: (locationData) =>
    api.post('/routes/locations/', locationData),

  // Update location (requires auth)
  updateLocation: (id, locationData) =>
    api.patch(`/routes/locations/${id}/`, locationData),

  // Delete location (requires auth)
  deleteLocation: (id) =>
    api.delete(`/routes/locations/${id}/`),
};
