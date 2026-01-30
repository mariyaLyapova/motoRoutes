import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="hero-content">
          <h1>Welcome to MotoRoutes</h1>
          <p>Share and discover amazing motorcycle routes around the world</p>

          {user ? (
            <div className="hero-buttons">
              <Link to="/routes" className="btn-hero-primary">Browse Routes</Link>
              <Link to="/routes/create" className="btn-hero-secondary">Create Route</Link>
            </div>
          ) : (
            <div className="hero-buttons">
              <Link to="/register" className="btn-hero-primary">Get Started</Link>
              <Link to="/routes" className="btn-hero-secondary">Explore Routes</Link>
            </div>
          )}
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
    </div>
  );
}
