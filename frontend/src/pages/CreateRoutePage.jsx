import { useNavigate } from 'react-router-dom';
import { routeService } from '../services/routeService';
import RouteForm from '../components/routes/RouteForm';

export default function CreateRoutePage() {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      // Create the route
      await routeService.createRoute({
        title: formData.title,
        description: formData.description,
        difficulty: formData.difficulty,
        distance: formData.distance,
        duration_days: formData.duration_days,
        geojson: formData.geojson,
      });

      // Show success message
      alert('Route created successfully!');

      // Navigate to the routes list page
      navigate('/routes');
    } catch (error) {
      console.error('Error creating route:', error);
      // Re-throw the error so RouteForm can handle it
      throw error;
    }
  };

  return (
    <div className="create-route-page">
      <div className="container">
        <div className="page-header">
          <h1>Create New Route</h1>
          <p>Share your favorite motorcycle route with the community</p>
        </div>

        <div className="form-container">
          <RouteForm onSubmit={handleSubmit} submitLabel="Create Route" showImageUpload={false} />
        </div>
      </div>
    </div>
  );
}
