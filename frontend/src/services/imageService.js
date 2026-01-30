import api from './api';

export const imageService = {
  // Get all images
  getImages: () =>
    api.get('/routes/images/'),

  // Get single image
  getImage: (id) =>
    api.get(`/routes/images/${id}/`),

  // Upload image (requires auth)
  // imageData should be FormData with: image (file), caption, route (optional), location (optional)
  uploadImage: (imageData) => {
    return api.post('/routes/images/', imageData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete image (requires auth)
  deleteImage: (id) =>
    api.delete(`/routes/images/${id}/`),
};
