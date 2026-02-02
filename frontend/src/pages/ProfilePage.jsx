import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { routeService } from '../services/routeService';
import ProfileInfo from '../components/user/ProfileInfo';
import ProfileEdit from '../components/user/ProfileEdit';
import RouteCard from '../components/routes/RouteCard';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalRoutes: 0, totalDistance: 0 });

  useEffect(() => {
    fetchUserRoutes();
  }, [user]);

  const fetchUserRoutes = async () => {
    try {
      setLoading(true);
      const data = await routeService.getUserRoutes(user.id);
      setRoutes(data);
      calculateStats(data);
    } catch (error) {
      console.error('Error fetching routes:', error);
      setRoutes([]);
      setStats({ totalRoutes: 0, totalDistance: 0 });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (routesData) => {
    const totalRoutes = routesData.length;
    const totalDistance = routesData.reduce((sum, route) => sum + (route.distance || 0), 0);
    setStats({ totalRoutes, totalDistance });
  };

  const handleSave = async (data) => {
    try {
      const result = await updateUser(data);
      if (result.success) {
        setEditMode(false);
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Failed to update profile' };
      }
    } catch (error) {
      return { success: false, error: 'Failed to update profile. Please try again.' };
    }
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="profile-loading">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        {/* Profile Header */}
        <div className="profile-header">
          <h1>{user.username}'s Profile</h1>
          {!editMode && (
            <button onClick={() => setEditMode(true)} className="btn-edit">
              Edit Profile
            </button>
          )}
        </div>

        {/* Profile Content or Edit Form */}
        {editMode ? (
          <ProfileEdit user={user} onSave={handleSave} onCancel={handleCancel} />
        ) : (
          <div className="profile-content">
            {/* Left Column: Profile Info and Stats */}
            <ProfileInfo user={user} stats={stats} />

            {/* Right Column: User's Routes */}
            <div className="profile-routes">
              <h2>My Routes ({stats.totalRoutes})</h2>
              {loading ? (
                <div className="profile-loading">Loading routes...</div>
              ) : routes.length > 0 ? (
                <div className="routes-grid">
                  {routes.map((route) => (
                    <RouteCard key={route.id} route={route} />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No routes yet. Create your first route!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
