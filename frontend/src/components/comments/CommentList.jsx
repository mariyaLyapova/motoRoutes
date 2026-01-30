import { useState } from 'react';
import { commentService } from '../../services/commentService';
import CommentForm from './CommentForm';
import { useAuth } from '../../hooks/useAuth';

export default function CommentList({ comments, routeId, onUpdate }) {
  const { user } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleAddComment = async (commentData) => {
    await commentService.createComment({
      ...commentData,
      route: routeId,
    });
    setShowAddForm(false);
    onUpdate();
  };

  const handleEditComment = async (commentData) => {
    await commentService.updateComment(editingId, commentData);
    setEditingId(null);
    onUpdate();
  };

  const handleDeleteComment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await commentService.deleteComment(id);
      onUpdate();
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  };

  const canComment = user !== null;

  return (
    <div className="comment-list-container">
      <div className="comment-list-header">
        <h2>Comments ({comments?.length || 0})</h2>
      </div>

      {canComment && !showAddForm && (
        <button onClick={() => setShowAddForm(true)} className="btn-add-comment">
          + Add Comment
        </button>
      )}

      {showAddForm && (
        <div className="comment-form-container">
          <CommentForm
            onSubmit={handleAddComment}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {comments && comments.length > 0 ? (
        <div className="comments-list">
          {comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              {editingId === comment.id ? (
                <div className="comment-edit-container">
                  <CommentForm
                    initialData={comment}
                    onSubmit={handleEditComment}
                    onCancel={() => setEditingId(null)}
                  />
                </div>
              ) : (
                <>
                  <div className="comment-header">
                    <div className="comment-author-info">
                      <strong className="comment-author">
                        {comment.author?.username || 'Unknown'}
                      </strong>
                      <span className="comment-date">{formatDate(comment.created_at)}</span>
                    </div>

                    {user && user.id === comment.author?.id && (
                      <div className="comment-actions">
                        <button
                          onClick={() => setEditingId(comment.id)}
                          className="btn-edit-comment"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="btn-delete-comment"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="comment-text">{comment.text}</p>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        !showAddForm && (
          <p className="no-comments">
            {canComment
              ? 'No comments yet. Be the first to comment!'
              : 'No comments yet.'}
          </p>
        )
      )}
    </div>
  );
}
