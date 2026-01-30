import api from './api';

export const commentService = {
  // Get all comments
  getComments: () =>
    api.get('/routes/comments/'),

  // Get single comment
  getComment: (id) =>
    api.get(`/routes/comments/${id}/`),

  // Create comment (requires auth)
  createComment: (commentData) =>
    api.post('/routes/comments/', commentData),

  // Update comment (requires auth, author only)
  updateComment: (id, commentData) =>
    api.patch(`/routes/comments/${id}/`, commentData),

  // Delete comment (requires auth, author only)
  deleteComment: (id) =>
    api.delete(`/routes/comments/${id}/`),
};
