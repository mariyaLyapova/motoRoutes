import React from 'react';

const ProfileInfo = ({ user, stats }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="profile-info-card">
      {/* Avatar Section */}
      <div className="profile-avatar-section">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.username}
            className="profile-avatar"
          />
        ) : (
          <div className="profile-avatar-placeholder">
            <span>{user.username.charAt(0).toUpperCase()}</span>
          </div>
        )}
      </div>

      {/* User Details */}
      <div className="profile-details">
        <div className="profile-field">
          <label>Username</label>
          <span>{user.username}</span>
        </div>

        <div className="profile-field">
          <label>Email</label>
          <span>{user.email}</span>
        </div>

        {user.bio && (
          <div className="profile-field">
            <label>About Me</label>
            <p>{user.bio}</p>
          </div>
        )}

        {/* Motorcycle Info - always show */}
        <div className="profile-field">
          <label>Motorcycle</label>
          <span>
            {(user.motorcycle_brand || user.motorcycle_model || user.motorcycle_year) ? (
              <>
                {user.motorcycle_brand && user.motorcycle_brand}
                {user.motorcycle_brand && user.motorcycle_model && ' '}
                {user.motorcycle_model && user.motorcycle_model}
                {user.motorcycle_year && ` (${user.motorcycle_year})`}
              </>
            ) : (
              <span className="empty-value">Not added yet</span>
            )}
          </span>
        </div>
      </div>

      {/* Statistics Card */}
      <div className="profile-stats">
        <h3>Statistics</h3>
        <div className="stat-row">
          <span className="stat-label">Total Routes</span>
          <span className="stat-value">{stats.totalRoutes}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Total Distance</span>
          <span className="stat-value">{stats.totalDistance.toFixed(1)} km</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
