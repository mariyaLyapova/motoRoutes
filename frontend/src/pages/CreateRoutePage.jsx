import { useNavigate } from 'react-router-dom';
import { routeService } from '../services/routeService';
import RouteForm from '../components/routes/RouteForm';

export default function CreateRoutePage() {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    const response = await routeService.createRoute(formData);
    // Navigate to the newly created route detail page
    navigate(`/routes/${response.data.id}`);
  };

  return (
    <div className="create-route-page">
      <div className="container">
        <div className="page-header">
          <h1>Create New Route</h1>
          <p>Share your favorite motorcycle route with the community</p>
        </div>

        <div className="form-container">
          <RouteForm onSubmit={handleSubmit} submitLabel="Create Route" />
        </div>
      </div>
    </div>
  );
}
