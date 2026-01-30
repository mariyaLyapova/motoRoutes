import { useState } from 'react';
import { imageService } from '../../services/imageService';
import ImageUpload from './ImageUpload';
import { useAuth } from '../../hooks/useAuth';

export default function ImageGallery({ images, routeId, locationId, isCreator, onUpdate }) {
  const { user } = useAuth();
  const [showUpload, setShowUpload] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      await imageService.deleteImage(imageId);
      onUpdate();
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image. Please try again.');
    }
  };

  const handleUploadSuccess = () => {
    setShowUpload(false);
    onUpdate();
  };

  const canUpload = user !== null;

  return (
    <div className="image-gallery-container">
      <div className="gallery-header">
        <h2>Photos ({images?.length || 0})</h2>
        {canUpload && !showUpload && (
          <button onClick={() => setShowUpload(true)} className="btn-add-image">
            + Add Photo
          </button>
        )}
      </div>

      {showUpload && (
        <div className="upload-section">
          <h3>Upload New Photo</h3>
          <ImageUpload
            routeId={routeId}
            locationId={locationId}
            onUploadSuccess={handleUploadSuccess}
          />
          <button onClick={() => setShowUpload(false)} className="btn-cancel-upload">
            Cancel
          </button>
        </div>
      )}

      {images && images.length > 0 ? (
        <div className="images-grid">
          {images.map((image) => (
            <div key={image.id} className="image-item">
              <div
                className="image-wrapper"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={`http://localhost:8000${image.image}`}
                  alt={image.caption || 'Route photo'}
                />
              </div>

              {image.caption && (
                <p className="image-caption">{image.caption}</p>
              )}

              <div className="image-meta">
                <span className="image-uploader">
                  By {image.uploader?.username || 'Unknown'}
                </span>

                {user && user.id === image.uploader?.id && (
                  <button
                    onClick={() => handleDeleteImage(image.id)}
                    className="btn-delete-image"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        !showUpload && (
          <p className="no-images">
            {canUpload
              ? 'No photos yet. Click "Add Photo" to upload the first one.'
              : 'No photos uploaded yet.'}
          </p>
        )
      )}

      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
            <img
              src={`http://localhost:8000${selectedImage.image}`}
              alt={selectedImage.caption || 'Route photo'}
            />
            {selectedImage.caption && (
              <p className="modal-caption">{selectedImage.caption}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
