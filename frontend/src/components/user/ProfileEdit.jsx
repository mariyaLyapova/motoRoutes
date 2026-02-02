import React, { useState } from 'react';

const ProfileEdit = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    bio: user.bio || '',
    motorcycle_brand: user.motorcycle_brand || '',
    motorcycle_model: user.motorcycle_model || '',
    motorcycle_year: user.motorcycle_year || ''
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Avatar must be less than 5MB');
      return;
    }

    setError('');
    setAvatarFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError('');

    try {
      let data;

      // If avatar file selected, use FormData
      if (avatarFile) {
        data = new FormData();
        data.append('avatar', avatarFile);
        data.append('bio', formData.bio);
        data.append('motorcycle_brand', formData.motorcycle_brand);
        data.append('motorcycle_model', formData.motorcycle_model);
        if (formData.motorcycle_year) {
          data.append('motorcycle_year', formData.motorcycle_year);
        }
      } else {
        // Regular JSON update
        data = {
          bio: formData.bio,
          motorcycle_brand: formData.motorcycle_brand,
          motorcycle_model: formData.motorcycle_model,
          motorcycle_year: formData.motorcycle_year || null
        };
      }

      const result = await onSave(data);

      if (!result.success) {
        setError(result.error || 'Failed to update profile');
      }
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="profile-edit-card">
      <h2>Edit Profile</h2>

      <form onSubmit={handleSubmit} className="profile-edit-form">
        {/* Avatar Upload */}
        <div className="form-group">
          <label>Profile Picture</label>
          <div className="avatar-upload-section">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Preview"
                className="avatar-preview"
              />
            ) : user.avatar ? (
              <img
                src={user.avatar}
                alt="Current"
                className="avatar-preview"
              />
            ) : (
              <div className="avatar-placeholder">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              id="avatar-input"
            />
            <label htmlFor="avatar-input" className="file-input-label">
              Choose Image
            </label>
          </div>
        </div>

        {/* Bio */}
        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            maxLength={500}
            rows={5}
            placeholder="Tell us about yourself..."
          />
          <small className="char-count">{formData.bio.length}/500 characters</small>
        </div>

        {/* Motorcycle Brand */}
        <div className="form-group">
          <label htmlFor="motorcycle_brand">Motorcycle Brand</label>
          <input
            type="text"
            id="motorcycle_brand"
            name="motorcycle_brand"
            value={formData.motorcycle_brand}
            onChange={handleChange}
            placeholder="e.g., Harley-Davidson, Honda, Yamaha"
          />
        </div>

        {/* Motorcycle Model */}
        <div className="form-group">
          <label htmlFor="motorcycle_model">Motorcycle Model</label>
          <input
            type="text"
            id="motorcycle_model"
            name="motorcycle_model"
            value={formData.motorcycle_model}
            onChange={handleChange}
            placeholder="e.g., Road King, CBR600RR"
          />
        </div>

        {/* Motorcycle Year */}
        <div className="form-group">
          <label htmlFor="motorcycle_year">Year</label>
          <input
            type="number"
            id="motorcycle_year"
            name="motorcycle_year"
            value={formData.motorcycle_year}
            onChange={handleChange}
            min="1900"
            max={new Date().getFullYear()}
            placeholder="e.g., 2020"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Action Buttons */}
        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn-cancel"
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-save"
            disabled={uploading}
          >
            {uploading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit;
