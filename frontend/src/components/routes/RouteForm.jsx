import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import RouteEditor from '../maps/RouteEditor';

export default function RouteForm({ initialData, onSubmit, submitLabel, showImageUpload = true }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    difficulty: initialData?.difficulty || 'moderate',
    distance: initialData?.distance || '',
    duration_days: initialData?.duration_days || '',
    geojson: initialData?.geojson ? JSON.stringify(initialData.geojson, null, 2) : '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState(initialData?.images || []);
  const [isDragging, setIsDragging] = useState(false);
  const [useMapEditor, setUseMapEditor] = useState(true);
  const [routeGeojson, setRouteGeojson] = useState(initialData?.geojson || null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleRouteChange = useCallback((geojson) => {
    setRouteGeojson(geojson);
    if (geojson) {
      setFormData((prev) => ({
        ...prev,
        geojson: JSON.stringify(geojson, null, 2),
      }));
      // Clear geojson error if it exists
      setErrors((prev) => {
        if (prev.geojson) {
          const { geojson: _, ...rest } = prev;
          return rest;
        }
        return prev;
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        geojson: '',
      }));
    }
  }, []);

  const handleDistanceChange = useCallback((calculatedDistance) => {
    setFormData((prev) => ({
      ...prev,
      distance: calculatedDistance,
    }));
    // Clear distance error if it exists
    if (errors.distance) {
      setErrors((prev) => ({
        ...prev,
        distance: '',
      }));
    }
  }, [errors.distance]);

  const processFiles = (files) => {
    const fileArray = Array.from(files);

    // Validate each file
    const validFiles = [];
    const newPreviews = [];

    fileArray.forEach((file) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return;
      }

      validFiles.push(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push({
          file,
          preview: reader.result
        });

        if (newPreviews.length === validFiles.length) {
          setImagePreviews((prev) => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setSelectedImages((prev) => [...prev, ...validFiles]);
  };

  const handleImageChange = (e) => {
    processFiles(e.target.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageId) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    // Distance is optional, but if provided, must be valid
    if (formData.distance && formData.distance <= 0) {
      newErrors.distance = 'Distance must be greater than 0';
    }

    if (!formData.geojson.trim()) {
      newErrors.geojson = 'GeoJSON is required';
    } else {
      try {
        const parsed = JSON.parse(formData.geojson);
        if (parsed.type !== 'LineString') {
          newErrors.geojson = 'GeoJSON must be a LineString type';
        }
        if (!parsed.coordinates || !Array.isArray(parsed.coordinates)) {
          newErrors.geojson = 'GeoJSON must have coordinates array';
        }
        if (parsed.coordinates && parsed.coordinates.length < 2) {
          newErrors.geojson = 'LineString must have at least 2 coordinate pairs';
        }
      } catch (e) {
        newErrors.geojson = 'Invalid JSON format';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting');
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        difficulty: formData.difficulty,
        distance: formData.distance ? parseFloat(formData.distance) : null,
        duration_days: formData.duration_days ? parseInt(formData.duration_days) : null,
        geojson: JSON.parse(formData.geojson),
        images: selectedImages,
        existingImages: existingImages.map(img => img.id), // IDs of existing images to keep
      };

      await onSubmit(submitData);
      toast.success('Route saved successfully!');
      // If we reach here, submission was successful
      // The parent component will handle navigation
      setLoading(false);
    } catch (error) {
      console.error('Form submission error:', error);
      if (error.response?.data) {
        setErrors(error.response.data);
        toast.error('Failed to save route. Please check the form for errors.');
      } else {
        toast.error('Failed to save route. Please try again.');
      }
      setLoading(false);
    }
  };

  const fillSampleGeoJSON = () => {
    const sampleGeoJSON = {
      type: 'LineString',
      coordinates: [
        [-122.4194, 37.7749],
        [-122.4084, 37.7849],
        [-122.3984, 37.7949],
      ],
    };
    setFormData((prev) => ({
      ...prev,
      geojson: JSON.stringify(sampleGeoJSON, null, 2),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="route-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="title">
            Route Title <span className="required">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Pacific Coast Highway"
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <span className="error-text">{errors.title}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="description">
            Description <span className="required">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your route, what makes it special..."
            rows="5"
            className={errors.description ? 'error' : ''}
          />
          {errors.description && <span className="error-text">{errors.description}</span>}
        </div>
      </div>

      <div className="form-row form-row-3">
        <div className="form-group">
          <label htmlFor="difficulty">
            Difficulty <span className="required">*</span>
          </label>
          <select
            id="difficulty"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
          >
            <option value="easy">Easy</option>
            <option value="moderate">Moderate</option>
            <option value="hard">Hard</option>
            <option value="expert">Expert</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="duration_days">
            Trip Duration (days)
          </label>
          <input
            type="number"
            id="duration_days"
            name="duration_days"
            value={formData.duration_days}
            onChange={handleChange}
            placeholder="e.g., 3"
            min="1"
            className={errors.duration_days ? 'error' : ''}
          />
          {errors.duration_days && <span className="error-text">{errors.duration_days}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <label htmlFor="geojson">
              Route Path <span className="required">*</span>
            </label>
            <button
              type="button"
              onClick={() => setUseMapEditor(!useMapEditor)}
              style={{
                padding: '6px 12px',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
              }}
            >
              {useMapEditor ? '📝 Switch to Text Editor' : '🗺️ Switch to Map Editor'}
            </button>
          </div>

          {useMapEditor ? (
            <RouteEditor
              value={formData.geojson}
              onChange={handleRouteChange}
              onDistanceChange={handleDistanceChange}
              height="500px"
            />
          ) : (
            <>
              <div style={{ marginBottom: '10px' }}>
                <button
                  type="button"
                  onClick={fillSampleGeoJSON}
                  className="sample-btn"
                >
                  Fill Sample
                </button>
              </div>
              <textarea
                id="geojson"
                name="geojson"
                value={formData.geojson}
                onChange={handleChange}
                placeholder='{"type": "LineString", "coordinates": [[-122.4194, 37.7749], [-122.4084, 37.7849]]}'
                rows="8"
                className={`geojson-input ${errors.geojson ? 'error' : ''}`}
              />
              <div className="help-text">
                Enter a GeoJSON LineString with coordinates in [longitude, latitude] format.
              </div>
            </>
          )}
          {errors.geojson && <span className="error-text">{errors.geojson}</span>}
        </div>
      </div>

      {showImageUpload && (
        <div className="form-row">
          <div className="form-group">
            <label>
              Route Photos (Optional)
            </label>
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="file-input-hidden"
              style={{ display: 'none' }}
            />
            <div
              className={`drag-drop-zone ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('images').click()}
            >
              <div className="drag-drop-icon">📷</div>
              <div className="drag-drop-text">
                <strong>Drag & drop photos here</strong>
                <span>or click to browse</span>
              </div>
              <div className="drag-drop-hint">Max 5MB per image</div>
            </div>

            {/* Existing Photos (from server) */}
            {existingImages.length > 0 && (
              <div className="existing-images-section">
                <h4 style={{ marginTop: '20px', marginBottom: '10px', fontSize: '14px', color: '#666' }}>
                  Current Photos ({existingImages.length})
                </h4>
                <div className="image-previews">
                  {existingImages.map((img) => (
                    <div key={img.id} className="image-preview-item">
                      <img src={img.image} alt="Route photo" />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(img.id)}
                        className="remove-image-btn"
                        title="Remove this photo"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Photos (to be uploaded) */}
            {imagePreviews.length > 0 && (
              <div className="new-images-section">
                <h4 style={{ marginTop: '20px', marginBottom: '10px', fontSize: '14px', color: '#666' }}>
                  New Photos to Upload ({imagePreviews.length})
                </h4>
                <div className="image-previews">
                  {imagePreviews.map((img, index) => (
                    <div key={index} className="image-preview-item">
                      <img src={img.preview} alt={`Preview ${index + 1}`} />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="remove-image-btn"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="form-actions">
        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
