import { useState } from 'react';

export default function LocationForm({ initialData, onSubmit, onCancel, routeId }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    location_type: initialData?.location_type || 'viewpoint',
    latitude: initialData?.latitude || '',
    longitude: initialData?.longitude || '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const locationTypes = [
    { value: 'gas_station', label: 'Gas Station' },
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'viewpoint', label: 'Viewpoint' },
    { value: 'hotel', label: 'Hotel' },
    { value: 'rest_area', label: 'Rest Area' },
    { value: 'attraction', label: 'Attraction' },
    { value: 'parking', label: 'Parking' },
    { value: 'other', label: 'Other' },
  ];

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

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.latitude || isNaN(formData.latitude)) {
      newErrors.latitude = 'Valid latitude is required';
    } else {
      const lat = parseFloat(formData.latitude);
      if (lat < -90 || lat > 90) {
        newErrors.latitude = 'Latitude must be between -90 and 90';
      }
    }

    if (!formData.longitude || isNaN(formData.longitude)) {
      newErrors.longitude = 'Valid longitude is required';
    } else {
      const lng = parseFloat(formData.longitude);
      if (lng < -180 || lng > 180) {
        newErrors.longitude = 'Longitude must be between -180 and 180';
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
        name: formData.name.trim(),
        description: formData.description.trim(),
        location_type: formData.location_type,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        route: routeId,
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

  return (
    <form onSubmit={handleSubmit} className="location-form">
      <div className="form-group">
        <label htmlFor="name">
          Location Name <span className="required">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Mountain Peak Viewpoint"
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span className="error-text">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="location_type">
          Type <span className="required">*</span>
        </label>
        <select
          id="location_type"
          name="location_type"
          value={formData.location_type}
          onChange={handleChange}
        >
          {locationTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-row-2">
        <div className="form-group">
          <label htmlFor="latitude">
            Latitude <span className="required">*</span>
          </label>
          <input
            type="number"
            id="latitude"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            placeholder="37.7749"
            step="any"
            className={errors.latitude ? 'error' : ''}
          />
          {errors.latitude && <span className="error-text">{errors.latitude}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="longitude">
            Longitude <span className="required">*</span>
          </label>
          <input
            type="number"
            id="longitude"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            placeholder="-122.4194"
            step="any"
            className={errors.longitude ? 'error' : ''}
          />
          {errors.longitude && <span className="error-text">{errors.longitude}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Optional description of this location..."
          rows="3"
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-cancel">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? 'Saving...' : initialData ? 'Save Changes' : 'Add Location'}
        </button>
      </div>
    </form>
  );
}
