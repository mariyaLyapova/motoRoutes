import { useState } from 'react';
import { imageService } from '../../services/imageService';

export default function ImageUpload({ routeId, locationId, onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    setError('');

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError('Please select an image');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('caption', caption);

      if (routeId) {
        formData.append('route', routeId);
      }
      if (locationId) {
        formData.append('location', locationId);
      }

      await imageService.uploadImage(formData);

      // Reset form
      setSelectedFile(null);
      setCaption('');
      setPreview(null);

      // Clear file input
      const fileInput = document.getElementById('image-file-input');
      if (fileInput) fileInput.value = '';

      // Notify parent
      onUploadSuccess();
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload image');
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setCaption('');
    setPreview(null);
    setError('');

    const fileInput = document.getElementById('image-file-input');
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="image-upload-container">
      <form onSubmit={handleUpload} className="image-upload-form">
        <div className="file-input-wrapper">
          <input
            type="file"
            id="image-file-input"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
          />
          <label htmlFor="image-file-input" className="file-input-label">
            {selectedFile ? selectedFile.name : 'Choose Image'}
          </label>
        </div>

        {preview && (
          <div className="image-preview">
            <img src={preview} alt="Preview" />
          </div>
        )}

        {selectedFile && (
          <>
            <div className="form-group">
              <label htmlFor="caption">Caption (optional)</label>
              <input
                type="text"
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a caption for this image..."
              />
            </div>

            <div className="upload-actions">
              <button
                type="button"
                onClick={handleCancel}
                className="btn-cancel"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-upload"
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload Image'}
              </button>
            </div>
          </>
        )}

        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
}
