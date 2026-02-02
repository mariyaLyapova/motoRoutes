import { useNavigate } from 'react-router-dom';
import { routeService } from '../services/routeService';
import { imageService } from '../services/imageService';
import RouteForm from '../components/routes/RouteForm';

export default function CreateRoutePage() {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    // First, create the route
    const response = await routeService.createRoute({
      title: formData.title,
      description: formData.description,
      difficulty: formData.difficulty,
      distance: formData.distance,
      geojson: formData.geojson,
    });
    
    const routeId = response.data.id;
    
    // Then, upload images if any
    if (formData.images && formData.images.length > 0) {
      const uploadPromises = formData.images.map((image, index) => {
        const imageFormData = new FormData();
        imageFormData.append('image', image);
        imageFormData.append('route', routeId);
        
        // Add caption if provided
        const caption = formData.imageCaptions[index];
        if (caption) {
          imageFormData.append('caption', caption);
        }
        
        return imageService.uploadImage(imageFormData);
      });
      
      await Promise.all(uploadPromises);
    }
    
    // Navigate to the newly created route detail page
    navigate(`/routes/${routeId}`);
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
