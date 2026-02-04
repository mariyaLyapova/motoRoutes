import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { routeService } from '../services/routeService';
import { useAuth } from '../hooks/useAuth';
import LocationList from '../components/locations/LocationList';
import ImageGallery from '../components/images/ImageGallery';
import CommentList from '../components/comments/CommentList';

export default function RouteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchRouteDetail();
  }, [id]);

  const fetchRouteDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await routeService.getRoute(id);
      setRoute(response.data);
    } catch (err) {
      console.error('Error fetching route:', err);
      const errorMessage = 'Failed to load route details. Please try again later.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this route?')) {
      return;
    }

    try {
      setDeleteLoading(true);
      await routeService.deleteRoute(id);
      toast.success('Route deleted successfully!');
      navigate('/routes');
    } catch (err) {
      console.error('Error deleting route:', err);
      toast.error('Failed to delete route. Please try again.');
      setDeleteLoading(false);
    }
  };

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
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="route-detail-page">
        <div className="container">
          <div className="loading-state">
            <p>Loading route details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !route) {
    return (
      <div className="route-detail-page">
        <div className="container">
          <div className="error-state">
            <p>{error || 'Route not found'}</p>
            <Link to="/routes" className="back-link">
              ← Back to Routes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isCreator = user && user.id === route.creator?.id;

  return (
    <div className="route-detail-page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/routes">Routes</Link>
          <span> / </span>
          <span>{route.title}</span>
        </div>

        <div className="route-detail-header">
          <div className="header-left">
            <h1>{route.title}</h1>
            <div className="route-meta">
              <span
                className="difficulty-badge"
                style={{ backgroundColor: getDifficultyColor(route.difficulty) }}
              >
                {route.difficulty}
              </span>
              <span className="meta-item">
                📏 {route.distance} km
              </span>
              <span className="meta-item">
                📅 {formatDate(route.created_at)}
              </span>
              <span className="meta-item">
                👤 By {route.creator ? (
                  <Link to={`/users/${route.creator.id}`} className="creator-link">
                    {route.creator.username}
                  </Link>
                ) : (
                  'Unknown'
                )}
              </span>
            </div>
          </div>

          {isCreator && (
            <div className="header-actions">
              <Link to={`/routes/${id}/edit`} className="btn-edit">
                Edit
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="btn-delete"
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>

        <div className="route-detail-content">
          <div className="main-column">
            <section className="route-section">
              <h2>Description</h2>
              <p className="route-description">{route.description}</p>
            </section>

            <section className="route-section">
              <LocationList
                locations={route.locations}
                routeId={id}
                isCreator={isCreator}
                onUpdate={fetchRouteDetail}
              />
            </section>

            <section className="route-section">
              <ImageGallery
                images={route.images}
                routeId={id}
                isCreator={isCreator}
                onUpdate={fetchRouteDetail}
              />
            </section>

            <section className="route-section">
              <CommentList
                comments={route.comments}
                routeId={id}
                onUpdate={fetchRouteDetail}
              />
            </section>
          </div>

          <div className="sidebar-column">
            <div className="stats-card">
              <h3>Route Statistics</h3>
              <div className="stat-row">
                <span className="stat-label">Distance</span>
                <span className="stat-value">{route.distance} km</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Difficulty</span>
                <span
                  className="stat-value"
                  style={{ color: getDifficultyColor(route.difficulty) }}
                >
                  {route.difficulty}
                </span>
              </div>
              <div className="stat-row">
                <span className="stat-label">POIs</span>
                <span className="stat-value">{route.locations?.length || 0}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Photos</span>
                <span className="stat-value">{route.images?.length || 0}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Comments</span>
                <span className="stat-value">{route.comments?.length || 0}</span>
              </div>
            </div>

            <div className="creator-card">
              <h3>Created By</h3>
              <div className="creator-info">
                <div className="creator-name">{route.creator?.username || 'Unknown'}</div>
                {route.creator?.motorcycle_brand && (
                  <div className="creator-bike">
                    🏍️ {route.creator.motorcycle_brand} {route.creator.motorcycle_model}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
