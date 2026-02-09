import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { routeService } from '../services/routeService';
import { useAuth } from '../hooks/useAuth';
import LocationList from '../components/locations/LocationList';
import ImageGallery from '../components/images/ImageGallery';
import CommentList from '../components/comments/CommentList';
import RouteMap from '../components/maps/RouteMap';

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
        <div className="magazine-design">
          {/* Magazine Header */}
          <div className="magazine-header">
            <div className="magazine-breadcrumb">
              <Link to="/routes">Routes</Link>
              <span> / </span>
              <span>{route.title}</span>
            </div>

            <h1 className="magazine-title">{route.title}</h1>
            <p className="magazine-subtitle">{route.description.length > 150 ? route.description.substring(0, 150) + '...' : route.description}</p>

            <div className="magazine-meta">
              <div className="magazine-stat-box">
                <div className="magazine-stat-label">Distance</div>
                <div className="magazine-stat-value">{route.distance}</div>
                <div className="magazine-stat-unit">kilometers</div>
              </div>

              <div className="magazine-divider"></div>

              {route.duration_days && (
                <>
                  <div className="magazine-stat-box">
                    <div className="magazine-stat-label">Duration</div>
                    <div className="magazine-stat-value">{route.duration_days}</div>
                    <div className="magazine-stat-unit">{route.duration_days === 1 ? 'day' : 'days'}</div>
                  </div>
                  <div className="magazine-divider"></div>
                </>
              )}

              <div className="magazine-stat-box">
                <div className="magazine-stat-label">Difficulty</div>
                <div className="magazine-stat-value" style={{ color: getDifficultyColor(route.difficulty) }}>
                  {route.difficulty}
                </div>
              </div>

              <div className="magazine-divider"></div>

              <div className="magazine-stat-box">
                <div className="magazine-stat-label">Creator</div>
                <div className="magazine-stat-creator">
                  <Link to={`/users/${route.creator?.id}`}>{route.creator?.username || 'Unknown'}</Link>
                </div>
              </div>

              {isCreator && (
                <>
                  <div className="magazine-divider"></div>
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
                </>
              )}
            </div>
          </div>

          {/* Magazine Body */}
          <div className="magazine-body">
            <div className="magazine-layout">
              {/* Main Content */}
              <div className="main-content">
                {/* Full Description */}
                <section className="content-section">
                  <h2 className="section-title">Description</h2>
                  <p className="description-text">{route.description}</p>
                </section>

                {/* Route Map */}
                <section className="content-section">
                  <h2 className="section-title">Route Map</h2>
                  <RouteMap
                    route={route}
                    locations={route.locations || []}
                    height="600px"
                  />
                </section>

                {/* Points of Interest */}
                <section className="content-section">
                  <LocationList
                    locations={route.locations}
                    routeId={id}
                    isCreator={isCreator}
                    onUpdate={fetchRouteDetail}
                  />
                </section>

                {/* Photos */}
                <section className="content-section">
                  <ImageGallery
                    images={route.images}
                    routeId={id}
                    isCreator={isCreator}
                    onUpdate={fetchRouteDetail}
                  />
                </section>

                {/* Comments */}
                <section className="content-section">
                  <CommentList
                    comments={route.comments}
                    routeId={id}
                    onUpdate={fetchRouteDetail}
                  />
                </section>
              </div>

              {/* Sidebar */}
              <div className="sidebar">
                <div className="stats-card">
                  <h4>Route Details</h4>
                  <div className="stats-row">
                    <span className="stats-label">Points of Interest</span>
                    <strong className="stats-value">{route.locations?.length || 0}</strong>
                  </div>
                  <div className="stats-row">
                    <span className="stats-label">Photos</span>
                    <strong className="stats-value">{route.images?.length || 0}</strong>
                  </div>
                  <div className="stats-row">
                    <span className="stats-label">Comments</span>
                    <strong className="stats-value">{route.comments?.length || 0}</strong>
                  </div>
                </div>

                <div className="creator-card">
                  <h4>Created By</h4>
                  <div className="creator-name">
                    <Link to={`/users/${route.creator?.id}`}>{route.creator?.username || 'Unknown'}</Link>
                  </div>
                  {route.creator?.motorcycle_brand && (
                    <>
                      <div className="creator-bike">🏍️ {route.creator.motorcycle_brand}</div>
                      {route.creator.motorcycle_model && (
                        <div className="creator-bike">{route.creator.motorcycle_model} {route.creator.motorcycle_year || ''}</div>
                      )}
                    </>
                  )}
                  <div className="creator-date">Created on {formatDate(route.created_at)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
