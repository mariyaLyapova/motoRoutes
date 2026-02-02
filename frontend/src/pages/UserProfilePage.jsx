import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userService } from '../services/userService';
import { routeService } from '../services/routeService';
import ProfileInfo from '../components/user/ProfileInfo';
import RouteCard from '../components/routes/RouteCard';

const UserProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ totalRoutes: 0, totalDistance: 0 });

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch user and routes in parallel
      const [userData, routesData] = await Promise.all([
        userService.getUser(id),
        routeService.getUserRoutes(id)
      ]);

      setUser(userData);
      setRoutes(routesData);
      calculateStats(routesData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error.response && error.response.status === 404) {
        setError('User not found');
      } else {
        setError('Failed to load user profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (routesData) => {
    const totalRoutes = routesData.length;
    const totalDistance = routesData.reduce((sum, route) => sum + (route.distance || 0), 0);
    setStats({ totalRoutes, totalDistance });
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="profile-loading">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="empty-state">
            <p>{error}</p>
            <Link to="/routes" className="btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>
              Back to Routes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="profile-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/routes">Routes</Link> / {user.username}
        </div>

        {/* Profile Header */}
        <div className="profile-header">
          <h1>{user.username}'s Profile</h1>
        </div>

        {/* Profile Content */}
        <div className="profile-content">
          {/* Left Column: Profile Info and Stats */}
          <ProfileInfo user={user} stats={stats} />

          {/* Right Column: User's Routes */}
          <div className="profile-routes">
            <h2>Routes by {user.username} ({stats.totalRoutes})</h2>
            {routes.length > 0 ? (
              <div className="routes-grid">
                {routes.map((route) => (
                  <RouteCard key={route.id} route={route} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>This user hasn't created any routes yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
