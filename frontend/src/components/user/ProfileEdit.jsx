import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';

const ProfileEdit = ({ user, onSave, onCancel }) => {
  const motorcycleTypes = [
    { value: '', label: 'Select Type' },
    { value: 'sport', label: 'Sport' },
    { value: 'cruiser', label: 'Cruiser' },
    { value: 'touring', label: 'Touring' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'naked', label: 'Naked/Standard' },
    { value: 'dual_sport', label: 'Dual Sport' },
    { value: 'scooter', label: 'Scooter' },
    { value: 'cafe_racer', label: 'Cafe Racer' },
    { value: 'scrambler', label: 'Scrambler' },
    { value: 'other', label: 'Other' }
  ];

  const countries = [
    { value: '', label: 'Select Country' },
    { value: 'United States', label: 'United States' },
    { value: 'Canada', label: 'Canada' },
    { value: 'United Kingdom', label: 'United Kingdom' },
    { value: 'Germany', label: 'Germany' },
    { value: 'France', label: 'France' },
    { value: 'Italy', label: 'Italy' },
    { value: 'Spain', label: 'Spain' },
    { value: 'Netherlands', label: 'Netherlands' },
    { value: 'Belgium', label: 'Belgium' },
    { value: 'Switzerland', label: 'Switzerland' },
    { value: 'Austria', label: 'Austria' },
    { value: 'Portugal', label: 'Portugal' },
    { value: 'Greece', label: 'Greece' },
    { value: 'Poland', label: 'Poland' },
    { value: 'Czech Republic', label: 'Czech Republic' },
    { value: 'Sweden', label: 'Sweden' },
    { value: 'Norway', label: 'Norway' },
    { value: 'Denmark', label: 'Denmark' },
    { value: 'Finland', label: 'Finland' },
    { value: 'Ireland', label: 'Ireland' },
    { value: 'Australia', label: 'Australia' },
    { value: 'New Zealand', label: 'New Zealand' },
    { value: 'Japan', label: 'Japan' },
    { value: 'South Korea', label: 'South Korea' },
    { value: 'China', label: 'China' },
    { value: 'India', label: 'India' },
    { value: 'Thailand', label: 'Thailand' },
    { value: 'Vietnam', label: 'Vietnam' },
    { value: 'Indonesia', label: 'Indonesia' },
    { value: 'Malaysia', label: 'Malaysia' },
    { value: 'Singapore', label: 'Singapore' },
    { value: 'Philippines', label: 'Philippines' },
    { value: 'Brazil', label: 'Brazil' },
    { value: 'Argentina', label: 'Argentina' },
    { value: 'Chile', label: 'Chile' },
    { value: 'Mexico', label: 'Mexico' },
    { value: 'Colombia', label: 'Colombia' },
    { value: 'Peru', label: 'Peru' },
    { value: 'South Africa', label: 'South Africa' },
    { value: 'Egypt', label: 'Egypt' },
    { value: 'Morocco', label: 'Morocco' },
    { value: 'Turkey', label: 'Turkey' },
    { value: 'Russia', label: 'Russia' },
    { value: 'Ukraine', label: 'Ukraine' },
    { value: 'Other', label: 'Other' }
  ];

  const [formData, setFormData] = useState({
    bio: user.bio || '',
    country: user.country || '',
    motorcycle_type: user.motorcycle_type || '',
    motorcycle_brand: user.motorcycle_brand || '',
    motorcycle_model: user.motorcycle_model || '',
    motorcycle_year: user.motorcycle_year || ''
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [countrySearch, setCountrySearch] = useState(user.country || '');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const countryDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
        setIsCountryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCountries = countries.filter(country => {
    if (country.value === '') return false;
    if (!formData.country || formData.country.trim() === '') return true;
    return country.label.toLowerCase().includes(formData.country.toLowerCase());
  });

  const handleCountrySearch = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, country: value }));
    if (!isCountryDropdownOpen) {
      setIsCountryDropdownOpen(true);
    }
  };

  const handleCountrySelect = (country) => {
    setFormData(prev => ({
      ...prev,
      country: country.value
    }));
    setIsCountryDropdownOpen(false);
  };

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
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Avatar must be less than 5MB');
      return;
    }

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

    try {
      let data;

      // If avatar file selected, use FormData
      if (avatarFile) {
        data = new FormData();
        data.append('avatar', avatarFile);
        data.append('bio', formData.bio);
        data.append('country', formData.country);
        data.append('motorcycle_type', formData.motorcycle_type);
        data.append('motorcycle_brand', formData.motorcycle_brand);
        data.append('motorcycle_model', formData.motorcycle_model);
        if (formData.motorcycle_year) {
          data.append('motorcycle_year', formData.motorcycle_year);
        }
      } else {
        // Regular JSON update
        data = {
          bio: formData.bio,
          country: formData.country,
          motorcycle_type: formData.motorcycle_type,
          motorcycle_brand: formData.motorcycle_brand,
          motorcycle_model: formData.motorcycle_model,
          motorcycle_year: formData.motorcycle_year || null
        };
      }

      const result = await onSave(data);

      if (result.success) {
        toast.success('Profile updated successfully!');
      } else {
        toast.error(result.error || 'Failed to update profile');
      }
    } catch (err) {
      toast.error('Failed to update profile. Please try again.');
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

        {/* About Me */}
        <div className="form-group">
          <label htmlFor="bio">About Me</label>
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

        {/* Country */}
        <div className="form-group">
          <label htmlFor="country">Country</label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="e.g., United States, Germany, Japan"
          />
        </div>

        {/* Motorcycle Type */}
        <div className="form-group">
          <label htmlFor="motorcycle_type">Motorcycle Type</label>
          <select
            id="motorcycle_type"
            name="motorcycle_type"
            value={formData.motorcycle_type}
            onChange={handleChange}
          >
            {motorcycleTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
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
