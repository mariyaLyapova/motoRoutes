import { useCallback, useState, useEffect } from 'react';
import { GoogleMap, Polyline, Marker, InfoWindow } from '@react-google-maps/api';
import { useGoogleMaps } from '../../context/GoogleMapsProvider';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 46.8182,
  lng: 8.2275,
};

const mapOptions = {
  streetViewControl: false,
  mapTypeControl: true,
  fullscreenControl: true,
  zoomControl: true,
};

const polylineOptions = {
  strokeColor: '#4a90e2',
  strokeOpacity: 0.8,
  strokeWeight: 4,
};

const getMarkerIcon = (locationType) => {
  const icons = {
    gas_station: '⛽',
    restaurant: '🍴',
    viewpoint: '📸',
    hotel: '🏨',
    rest_area: '🅿️',
    attraction: '⭐',
    parking: '🅿️',
    other: '📍',
  };
  return icons[locationType] || '📍';
};

export default function RouteMap({ route, locations = [], height = '500px', zoom = 10 }) {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [map, setMap] = useState(null);

  const { isLoaded, loadError } = useGoogleMaps();

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Fit bounds when map loads or route/locations change
  useEffect(() => {
    if (!map || !window.google?.maps?.LatLngBounds) return;

    try {
      // Fit bounds to show entire route
      if (route?.geojson?.coordinates && route.geojson.coordinates.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();

        // Add route coordinates to bounds
        route.geojson.coordinates.forEach(([lng, lat]) => {
          bounds.extend({ lat, lng });
        });

        // Add location markers to bounds
        locations.forEach((location) => {
          bounds.extend({ lat: location.latitude, lng: location.longitude });
        });

        map.fitBounds(bounds);
      } else if (locations.length > 0) {
        // If no route but have locations, center on locations
        const bounds = new window.google.maps.LatLngBounds();
        locations.forEach((location) => {
          bounds.extend({ lat: location.latitude, lng: location.longitude });
        });
        map.fitBounds(bounds);
      }
    } catch (error) {
      console.error('Error fitting bounds:', error);
    }
  }, [map, route, locations]);

  if (loadError) {
    return (
      <div style={{ ...mapContainerStyle, height }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          background: '#f5f5f5',
          color: '#666',
          borderRadius: '8px',
        }}>
          Error loading map. Please check your API key configuration.
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div style={{ ...mapContainerStyle, height }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          background: '#f5f5f5',
          color: '#666',
          borderRadius: '8px',
        }}>
          Loading map...
        </div>
      </div>
    );
  }

  // Convert GeoJSON coordinates to Google Maps format
  const routePath = route?.geojson?.coordinates?.map(([lng, lat]) => ({
    lat,
    lng,
  })) || [];

  return (
    <div style={{ ...mapContainerStyle, height, borderRadius: '8px', overflow: 'hidden' }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        {/* Route polyline */}
        {routePath.length > 0 && (
          <Polyline
            path={routePath}
            options={polylineOptions}
          />
        )}

        {/* Location markers */}
        {isLoaded && window.google?.maps?.SymbolPath && locations.map((location) => (
          <Marker
            key={location.id}
            position={{ lat: location.latitude, lng: location.longitude }}
            onClick={() => setSelectedLocation(location)}
            label={{
              text: getMarkerIcon(location.location_type),
              fontSize: '24px',
            }}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 0,
            }}
          />
        ))}

        {/* Info window for selected location */}
        {selectedLocation && (
          <InfoWindow
            position={{
              lat: selectedLocation.latitude,
              lng: selectedLocation.longitude
            }}
            onCloseClick={() => setSelectedLocation(null)}
          >
            <div style={{ maxWidth: '250px' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>
                {getMarkerIcon(selectedLocation.location_type)} {selectedLocation.name}
              </h3>
              {selectedLocation.description && (
                <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                  {selectedLocation.description}
                </p>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
