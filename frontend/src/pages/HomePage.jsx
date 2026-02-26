import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { routeService } from '../services/routeService';
import RouteCard from '../components/routes/RouteCard';

export default function HomePage() {
  const { user } = useAuth();
  const [recentRoutes, setRecentRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRoutes: 0,
    totalRiders: 0,
    totalCountries: 0
  });

  useEffect(() => {
    loadRecentRoutes();
  }, []);

  const loadRecentRoutes = async () => {
    try {
      setLoading(true);
      const response = await routeService.getRoutes(1, {});
      // Get the first 6 routes for the home page
      setRecentRoutes(response.data.results.slice(0, 6));

      // Calculate stats from the response
      const totalRoutes = response.data.count || 0;

      // Get unique countries and riders from all routes
      const allRoutes = response.data.results || [];
      const uniqueCountries = new Set(allRoutes.map(route => route.country).filter(Boolean));
      const uniqueRiders = new Set(allRoutes.map(route => route.creator).filter(Boolean));

      setStats({
        totalRoutes: totalRoutes,
        totalRiders: uniqueRiders.size || totalRoutes, // fallback to route count if no unique riders
        totalCountries: uniqueCountries.size || 0
      });
    } catch (error) {
      console.error('Failed to load recent routes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="hero-content">
          <div className="hero-badge">For Motorcycle Enthusiasts</div>
          <h1>Ride Beyond Limits</h1>
          <p>Discover, share and explore the world's most thrilling motorcycle routes</p>

          {user ? (
            <div className="hero-buttons">
              <Link to="/routes" className="btn-hero-primary">
                Browse Routes
                <span>→</span>
              </Link>
            </div>
          ) : (
            <div className="hero-buttons">
              <Link to="/register" className="btn-hero-primary">
                Get Started
                <span>→</span>
              </Link>
              <Link to="/routes" className="btn-hero-secondary">Explore Routes</Link>
            </div>
          )}

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">{stats.totalRoutes}</span>
              <span className="stat-label">Routes</span>
            </div>
            <div className="stat">
              <span className="stat-number">{stats.totalRiders}</span>
              <span className="stat-label">Riders</span>
            </div>
            <div className="stat">
              <span className="stat-number">{stats.totalCountries}</span>
              <span className="stat-label">Countries</span>
            </div>
          </div>
        </div>
      </div>

      <div className="home-features">
        <div className="feature">
          <div className="feature-icon">🗺️</div>
          <h3>Interactive Maps</h3>
          <p>Draw and share your favorite motorcycle routes with our easy-to-use mapping tools</p>
        </div>

        <div className="feature">
          <div className="feature-icon">📍</div>
          <h3>Points of Interest</h3>
          <p>Mark gas stations, restaurants, viewpoints, and other important locations along your routes</p>
        </div>

        <div className="feature">
          <div className="feature-icon">📸</div>
          <h3>Share Photos</h3>
          <p>Upload photos from your rides and inspire others to explore new destinations</p>
        </div>

        <div className="feature">
          <div className="feature-icon">💬</div>
          <h3>Community</h3>
          <p>Connect with fellow riders, share tips, and discover the best routes in your area</p>
        </div>
      </div>

      <div className="home-recent-routes">
        <div className="section-header">
          <h2>Recent Routes</h2>
          <Link to="/routes" className="view-all-link">View All →</Link>
        </div>

        {loading ? (
          <div className="loading-message">Loading routes...</div>
        ) : recentRoutes.length > 0 ? (
          <div className="routes-grid">
            {recentRoutes.map(route => (
              <RouteCard key={route.id} route={route} />
            ))}
          </div>
        ) : (
          <div className="no-routes-message">
            <p>No routes yet. Be the first to create one!</p>
            {user && (
              <Link to="/routes/create" className="btn-primary">Create Route</Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
