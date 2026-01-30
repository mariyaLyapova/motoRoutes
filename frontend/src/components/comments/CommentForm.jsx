import { useState } from 'react';

export default function CommentForm({ initialData, onSubmit, onCancel }) {
  const [text, setText] = useState(initialData?.text || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit({ text: text.trim() });
    } catch (err) {
      console.error('Comment submission error:', err);
      setError(err.response?.data?.text || 'Failed to submit comment');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setError('');
        }}
        placeholder="Write your comment..."
        rows="3"
        className={error ? 'error' : ''}
      />
      {error && <span className="error-text">{error}</span>}

      <div className="comment-form-actions">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-cancel">
            Cancel
          </button>
        )}
        <button type="submit" disabled={loading} className="btn-submit-comment">
          {loading ? 'Posting...' : initialData ? 'Save Changes' : 'Post Comment'}
        </button>
      </div>
    </form>
  );
}
