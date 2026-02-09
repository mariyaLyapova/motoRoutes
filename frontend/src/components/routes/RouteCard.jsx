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

  const getGradient = (difficulty) => {
    const gradients = {
      easy: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)',
      moderate: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      hard: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      expert: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    };
    return gradients[difficulty] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  };

  const getRouteIcon = (difficulty) => {
    const icons = {
      easy: '🛣️',
      moderate: '🏞️',
      hard: '🏔️',
      expert: '⛰️',
    };
    return icons[difficulty] || '🏍️';
  };

  const cardImageStyle = route.first_image
    ? {
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.5)), url(${route.first_image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {
        background: getGradient(route.difficulty),
      };

  return (
    <Link to={`/routes/${route.id}`} className="route-card">
      <div className="card-image" style={cardImageStyle}>
        {!route.first_image && (
          <div className="card-image-emoji">{getRouteIcon(route.difficulty)}</div>
        )}
        <div className="card-image-overlay">
          <h3 className="card-title">
            {route.title}
          </h3>
          <span
            className="difficulty-badge"
            style={{ backgroundColor: getDifficultyColor(route.difficulty) }}
          >
            {route.difficulty}
          </span>
        </div>
      </div>

      <div className="card-content">
        <p className="route-description">
          {route.description.length > 100
            ? route.description.substring(0, 100) + '...'
            : route.description}
        </p>

        <div className="route-stats">
          <div className="stat">
            <span className="stat-icon">📏</span>
            <span className="stat-value">{route.distance} km</span>
          </div>

          {route.duration_days && (
            <div className="stat">
              <span className="stat-icon">📅</span>
              <span className="stat-value">{route.duration_days} {route.duration_days === 1 ? 'day' : 'days'}</span>
            </div>
          )}

          <div className="stat">
            <span className="stat-icon">📍</span>
            <span className="stat-value">{route.locations_count || 0}</span>
          </div>

          <div className="stat">
            <span className="stat-icon">📸</span>
            <span className="stat-value">{route.images_count || 0}</span>
          </div>

          <div className="stat">
            <span className="stat-icon">💬</span>
            <span className="stat-value">{route.comments_count || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
