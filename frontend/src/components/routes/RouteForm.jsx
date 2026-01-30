import { useState } from 'react';

export default function RouteForm({ initialData, onSubmit, submitLabel }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    difficulty: initialData?.difficulty || 'moderate',
    distance: initialData?.distance || '',
    geojson: initialData?.geojson ? JSON.stringify(initialData.geojson, null, 2) : '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.distance || formData.distance <= 0) {
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
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        difficulty: formData.difficulty,
        distance: parseFloat(formData.distance),
        geojson: JSON.parse(formData.geojson),
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
      if (error.response?.data) {
        setErrors(error.response.data);
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

      <div className="form-row form-row-2">
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
          <label htmlFor="distance">
            Distance (km) <span className="required">*</span>
          </label>
          <input
            type="number"
            id="distance"
            name="distance"
            value={formData.distance}
            onChange={handleChange}
            placeholder="0"
            step="0.1"
            min="0"
            className={errors.distance ? 'error' : ''}
          />
          {errors.distance && <span className="error-text">{errors.distance}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="geojson">
            Route Path (GeoJSON) <span className="required">*</span>
            <button
              type="button"
              onClick={fillSampleGeoJSON}
              className="sample-btn"
            >
              Fill Sample
            </button>
          </label>
          <textarea
            id="geojson"
            name="geojson"
            value={formData.geojson}
            onChange={handleChange}
            placeholder='{"type": "LineString", "coordinates": [[-122.4194, 37.7749], [-122.4084, 37.7849]]}'
            rows="8"
            className={`geojson-input ${errors.geojson ? 'error' : ''}`}
          />
          {errors.geojson && <span className="error-text">{errors.geojson}</span>}
          <div className="help-text">
            Enter a GeoJSON LineString with coordinates in [longitude, latitude] format.
            Map drawing will be added in a future update.
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
