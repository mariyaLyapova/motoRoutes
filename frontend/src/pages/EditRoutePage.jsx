import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { routeService } from '../services/routeService';
import { useAuth } from '../hooks/useAuth';
import RouteForm from '../components/routes/RouteForm';

export default function EditRoutePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRoute();
  }, [id]);

  const fetchRoute = async () => {
    try {
      setLoading(true);
      const response = await routeService.getRoute(id);
      setRoute(response.data);

      // Check if user is the creator
      if (user && user.id !== response.data.creator?.id) {
        setError('You do not have permission to edit this route.');
      }
    } catch (err) {
      console.error('Error fetching route:', err);
      setError('Failed to load route. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    await routeService.updateRoute(id, formData);
    // Navigate to the updated route detail page
    navigate(`/routes/${id}`);
  };

  if (loading) {
    return (
      <div className="edit-route-page">
        <div className="container">
          <div className="loading-state">
            <p>Loading route...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="edit-route-page">
        <div className="container">
          <div className="error-state">
            <p>{error}</p>
            <Link to={`/routes/${id}`} className="back-link">
              ← Back to Route
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-route-page">
      <div className="container">
        <div className="page-header">
          <h1>Edit Route</h1>
          <p>Update your route information</p>
        </div>

        <div className="form-container">
          <RouteForm
            initialData={route}
            onSubmit={handleSubmit}
            submitLabel="Save Changes"
          />
        </div>
      </div>
    </div>
  );
}
