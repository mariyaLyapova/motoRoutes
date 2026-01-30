import { Link } from 'react-router-dom';

export default function RouteCard({ route }) {
  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: '#27ae60',
      moderate: '#f39c12',
      hard: '#e67e22',
      expert: '#e74c3c',
    };
    return colors[difficulty] || '#95a5a6';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="route-card">
      <div className="route-card-header">
        <h3 className="route-title">
          <Link to={`/routes/${route.id}`}>{route.title}</Link>
        </h3>
        <span
          className="difficulty-badge"
          style={{ backgroundColor: getDifficultyColor(route.difficulty) }}
        >
          {route.difficulty}
        </span>
      </div>

      <p className="route-description">
        {route.description.length > 150
          ? route.description.substring(0, 150) + '...'
          : route.description}
      </p>

      <div className="route-stats">
        <div className="stat">
          <span className="stat-icon">📏</span>
          <span className="stat-value">{route.distance} km</span>
        </div>

        <div className="stat">
          <span className="stat-icon">📍</span>
          <span className="stat-value">{route.locations_count || 0} POIs</span>
        </div>

        <div className="stat">
          <span className="stat-icon">📸</span>
          <span className="stat-value">{route.images_count || 0} photos</span>
        </div>

        <div className="stat">
          <span className="stat-icon">💬</span>
          <span className="stat-value">{route.comments_count || 0} comments</span>
        </div>
      </div>

      <div className="route-footer">
        <div className="route-creator">
          <span className="creator-label">By:</span>
          <span className="creator-name">{route.creator?.username || 'Unknown'}</span>
        </div>
        <div className="route-date">{formatDate(route.created_at)}</div>
      </div>

      <Link to={`/routes/${route.id}`} className="view-route-btn">
        View Details
      </Link>
    </div>
  );
}
