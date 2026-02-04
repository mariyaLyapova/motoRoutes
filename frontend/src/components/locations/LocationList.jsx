import { useState } from 'react';
import toast from 'react-hot-toast';
import { locationService } from '../../services/locationService';
import LocationForm from './LocationForm';

export default function LocationList({ locations, routeId, isCreator, onUpdate }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const getLocationIcon = (type) => {
    const icons = {
      gas_station: '⛽',
      restaurant: '🍽️',
      viewpoint: '👁️',
      hotel: '🏨',
      rest_area: '🅿️',
      attraction: '🎯',
      parking: '🚗',
      other: '📍',
    };
    return icons[type] || '📍';
  };

  const handleAddLocation = async (locationData) => {
    try {
      await locationService.createLocation(locationData);
      toast.success('Location added successfully!');
      setShowAddForm(false);
      onUpdate();
    } catch (error) {
      console.error('Error adding location:', error);
      toast.error('Failed to add location. Please try again.');
    }
  };

  const handleEditLocation = async (locationData) => {
    try {
      await locationService.updateLocation(editingId, locationData);
      toast.success('Location updated successfully!');
      setEditingId(null);
      onUpdate();
    } catch (error) {
      console.error('Error updating location:', error);
      toast.error('Failed to update location. Please try again.');
    }
  };

  const handleDeleteLocation = async (id) => {
    if (!window.confirm('Are you sure you want to delete this location?')) {
      return;
    }

    try {
      await locationService.deleteLocation(id);
      toast.success('Location deleted successfully!');
      onUpdate();
    } catch (error) {
      console.error('Error deleting location:', error);
      toast.error('Failed to delete location. Please try again.');
    }
  };

  return (
    <div className="location-list-container">
      <div className="location-list-header">
        <h2>Points of Interest ({locations?.length || 0})</h2>
        {isCreator && !showAddForm && (
          <button onClick={() => setShowAddForm(true)} className="btn-add-location">
            + Add Location
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="location-form-container">
          <h3>Add New Location</h3>
          <LocationForm
            routeId={routeId}
            onSubmit={handleAddLocation}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {locations && locations.length > 0 ? (
        <div className="locations-list">
          {locations.map((location) => (
            <div key={location.id} className="location-item">
              {editingId === location.id ? (
                <div className="location-form-container">
                  <h3>Edit Location</h3>
                  <LocationForm
                    initialData={location}
                    routeId={routeId}
                    onSubmit={handleEditLocation}
                    onCancel={() => setEditingId(null)}
                  />
                </div>
              ) : (
                <>
                  <div className="location-content">
                    <div className="location-header">
                      <span className="location-icon">
                        {getLocationIcon(location.location_type)}
                      </span>
                      <div className="location-info">
                        <h3>{location.name}</h3>
                        <span className="location-type">
                          {location.location_type.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {location.description && (
                      <p className="location-description">{location.description}</p>
                    )}

                    <div className="location-coords">
                      📍 {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                    </div>
                  </div>

                  {isCreator && (
                    <div className="location-actions">
                      <button
                        onClick={() => setEditingId(location.id)}
                        className="btn-edit-small"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteLocation(location.id)}
                        className="btn-delete-small"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        !showAddForm && (
          <p className="no-locations">
            {isCreator
              ? 'No locations added yet. Click "Add Location" to get started.'
              : 'No locations added to this route yet.'}
          </p>
        )
      )}
    </div>
  );
}
