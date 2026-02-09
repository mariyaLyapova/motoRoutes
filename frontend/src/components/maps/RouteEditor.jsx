import { useCallback, useState, useEffect, useRef } from 'react';
import { GoogleMap, Polyline, Marker, DirectionsRenderer } from '@react-google-maps/api';
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

export default function RouteEditor({ value, onChange, onDistanceChange, height = '500px' }) {
  const [map, setMap] = useState(null);
  const [path, setPath] = useState([]);
  const [distance, setDistance] = useState(0);
  const [directions, setDirections] = useState(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [routeLink, setRouteLink] = useState('');
  const [linkError, setLinkError] = useState('');
  const initialLoadRef = useRef(true);
  const isFirstRenderRef = useRef(true);

  const { isLoaded, loadError } = useGoogleMaps();

  // Load initial value if provided
  useEffect(() => {
    if (!value || !initialLoadRef.current) return;

    try {
      const geojson = typeof value === 'string' ? JSON.parse(value) : value;
      if (geojson?.type === 'LineString' && geojson?.coordinates && Array.isArray(geojson.coordinates)) {
        const loadedPath = geojson.coordinates.map(([lng, lat]) => ({ lat, lng }));
        setPath(loadedPath);
      }
    } catch (e) {
      // Ignore parse errors for empty or invalid initial values
      console.debug('Could not parse initial GeoJSON:', e.message);
    } finally {
      initialLoadRef.current = false;
    }
  }, [value]);

  // Calculate real route using Directions API whenever waypoints change
  useEffect(() => {
    if (path.length < 2 || !window.google?.maps?.DirectionsService) {
      setDirections(null);
      setDistance(0);
      return;
    }

    setIsCalculatingRoute(true);
    const directionsService = new window.google.maps.DirectionsService();

    // Prepare waypoints - first and last are origin/destination
    // Everything in between is a waypoint
    const origin = path[0];
    const destination = path[path.length - 1];
    const waypoints = path.slice(1, -1).map(point => ({
      location: new window.google.maps.LatLng(point.lat, point.lng),
      stopover: true,
    }));

    directionsService.route(
      {
        origin: new window.google.maps.LatLng(origin.lat, origin.lng),
        destination: new window.google.maps.LatLng(destination.lat, destination.lng),
        waypoints: waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
        optimizeWaypoints: false, // Keep user's order
      },
      (result, status) => {
        setIsCalculatingRoute(false);
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);

          // Calculate total distance from the route
          const route = result.routes[0];
          let totalDistance = 0;
          route.legs.forEach(leg => {
            totalDistance += leg.distance.value; // in meters
          });
          const distanceInKm = (totalDistance / 1000).toFixed(2);
          setDistance(distanceInKm);

          // Notify parent component of distance change
          if (onDistanceChange) {
            onDistanceChange(distanceInKm);
          }
        } else {
          console.error('Directions request failed:', status);
          setDirections(null);
          setDistance(0);
          if (onDistanceChange) {
            onDistanceChange(0);
          }
        }
      }
    );
  }, [path, onDistanceChange]);

  // Update parent component when directions change (use real route path)
  useEffect(() => {
    if (!onChange) return;

    // Skip onChange on first render to avoid circular updates
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }

    if (directions && directions.routes?.[0]?.overview_path) {
      // Use the actual route path from Directions API
      const routePath = directions.routes[0].overview_path;
      const geojson = {
        type: 'LineString',
        coordinates: routePath.map(point => [point.lng(), point.lat()]),
      };
      onChange(geojson);
    } else if (path.length >= 2) {
      // Fallback to straight line if directions not available
      const geojson = {
        type: 'LineString',
        coordinates: path.map(point => [point.lng, point.lat]),
      };
      onChange(geojson);
    } else if (path.length === 0) {
      onChange(null);
    }
  }, [directions, path, onChange]);

  // Fit map bounds when path changes (only if we have 2+ points)
  useEffect(() => {
    if (!map || path.length < 2 || !window.google?.maps?.LatLngBounds) return;

    try {
      const bounds = new window.google.maps.LatLngBounds();
      path.forEach((point) => bounds.extend(point));
      map.fitBounds(bounds);
    } catch (error) {
      console.error('Error fitting bounds:', error);
    }
  }, [map, path]);

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMapClick = useCallback((e) => {
    if (!e?.latLng) return;

    try {
      const newPoint = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };
      setPath((prev) => [...prev, newPoint]);
    } catch (error) {
      console.error('Error handling map click:', error);
    }
  }, []);

  const handleMarkerDragEnd = useCallback((index, e) => {
    if (!e.latLng) return;

    setPath((prev) => {
      const newPath = [...prev];
      newPath[index] = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };
      return newPath;
    });
  }, []);

  const handleMarkerRightClick = useCallback((index) => {
    setPath((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearPath = useCallback(() => {
    setPath([]);
  }, []);

  const undoLastPoint = useCallback(() => {
    setPath((prev) => prev.slice(0, -1));
  }, []);

  const parseGoogleMapsLink = useCallback((url) => {
    try {
      setLinkError('');

      // Extract coordinates from Google Maps URL
      // Format: https://www.google.com/maps/dir/lat1,lng1/lat2,lng2/lat3,lng3
      const dirMatch = url.match(/\/dir\/([^/]+)/);
      if (dirMatch) {
        const locations = dirMatch[1].split('/');
        const waypoints = [];

        locations.forEach(loc => {
          // Try to parse as coordinates (lat,lng)
          const coordMatch = loc.match(/^(-?\d+\.?\d*),(-?\d+\.?\d*)$/);
          if (coordMatch) {
            waypoints.push({
              lat: parseFloat(coordMatch[1]),
              lng: parseFloat(coordMatch[2]),
            });
          }
        });

        if (waypoints.length >= 2) {
          setPath(waypoints);
          setShowLinkInput(false);
          setRouteLink('');
          return true;
        }
      }

      // Try to extract from @lat,lng format
      const atMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
      if (atMatch) {
        // Single point - can't create a route
        setLinkError('This link contains only one point. Please provide a route with multiple waypoints.');
        return false;
      }

      setLinkError('Could not parse this link. Please paste a Google Maps directions link with multiple waypoints.');
      return false;
    } catch (error) {
      setLinkError('Invalid link format. Please paste a valid Google Maps link.');
      return false;
    }
  }, []);

  const handlePasteLink = useCallback(() => {
    if (!routeLink.trim()) {
      setLinkError('Please paste a route link');
      return;
    }

    parseGoogleMapsLink(routeLink.trim());
  }, [routeLink, parseGoogleMapsLink]);

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

  return (
    <div>
      <div style={{
        marginBottom: '10px',
        padding: '12px',
        background: '#f8f9fa',
        borderRadius: '8px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setShowLinkInput(!showLinkInput)}
            style={{
              padding: '8px 16px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            🔗 Paste Route Link
          </button>
          <button
            type="button"
            onClick={undoLastPoint}
            disabled={path.length === 0}
            style={{
              padding: '8px 16px',
              background: path.length === 0 ? '#e0e0e0' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: path.length === 0 ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            ↶ Undo Last Point
          </button>
          <button
            type="button"
            onClick={clearPath}
            disabled={path.length === 0}
            style={{
              padding: '8px 16px',
              background: path.length === 0 ? '#e0e0e0' : '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: path.length === 0 ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            ✕ Clear All
          </button>
        </div>
        <div style={{
          display: 'flex',
          gap: '15px',
          fontSize: '14px',
          color: '#666',
          fontWeight: '500',
        }}>
          <span>Points: {path.length}</span>
          {distance > 0 && <span>Distance: {distance} km</span>}
          {isCalculatingRoute && <span style={{ color: '#4a90e2' }}>Calculating route...</span>}
        </div>
      </div>

      {showLinkInput && (
        <div style={{
          marginBottom: '10px',
          padding: '12px',
          background: '#fff3cd',
          borderRadius: '8px',
          border: '1px solid #ffc107',
        }}>
          <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#856404' }}>
            Paste a Google Maps route link
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <input
              type="text"
              value={routeLink}
              onChange={(e) => {
                setRouteLink(e.target.value);
                setLinkError('');
              }}
              placeholder="https://www.google.com/maps/dir/..."
              style={{
                flex: 1,
                padding: '8px 12px',
                border: linkError ? '2px solid #dc3545' : '1px solid #ccc',
                borderRadius: '6px',
                fontSize: '14px',
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handlePasteLink();
                }
              }}
            />
            <button
              type="button"
              onClick={handlePasteLink}
              style={{
                padding: '8px 16px',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              Import
            </button>
            <button
              type="button"
              onClick={() => {
                setShowLinkInput(false);
                setRouteLink('');
                setLinkError('');
              }}
              style={{
                padding: '8px 16px',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              Cancel
            </button>
          </div>
          {linkError && (
            <div style={{ marginTop: '8px', fontSize: '13px', color: '#dc3545' }}>
              {linkError}
            </div>
          )}
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#856404' }}>
            💡 Tip: Open Google Maps, create a route with directions, and copy the URL from your browser
          </div>
        </div>
      )}

      <div style={{
        marginBottom: '10px',
        padding: '10px',
        background: '#e3f2fd',
        borderRadius: '8px',
        fontSize: '13px',
        color: '#1976d2',
      }}>
        <strong>Draw your route:</strong> Click on the map to add waypoints. The route will automatically follow real roads between your points. Drag markers to adjust positions, or right-click to remove them.
      </div>

      <div style={{ ...mapContainerStyle, height, borderRadius: '8px', overflow: 'hidden' }}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={defaultCenter}
          zoom={8}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={mapOptions}
          onClick={handleMapClick}
        >
          {/* Real route from Directions API */}
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                suppressMarkers: true, // We'll show our own markers
                polylineOptions: {
                  strokeColor: '#4a90e2',
                  strokeOpacity: 0.8,
                  strokeWeight: 4,
                },
              }}
            />
          )}

          {/* Fallback: Show straight line if no directions yet */}
          {!directions && path.length > 1 && (
            <Polyline
              path={path}
              options={{
                ...polylineOptions,
                strokeOpacity: 0.4,
                strokeColor: '#cccccc',
              }}
            />
          )}

          {/* Draggable markers for waypoints */}
          {isLoaded && window.google?.maps?.SymbolPath && path.map((point, index) => (
            <Marker
              key={`${point.lat}-${point.lng}-${index}`}
              position={point}
              draggable={true}
              onDragEnd={(e) => handleMarkerDragEnd(index, e)}
              onRightClick={() => handleMarkerRightClick(index)}
              label={{
                text: (index + 1).toString(),
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: index === 0 ? '#28a745' : index === path.length - 1 ? '#dc3545' : '#4a90e2',
                fillOpacity: 1,
                strokeColor: 'white',
                strokeWeight: 2,
              }}
            />
          ))}
        </GoogleMap>
      </div>
    </div>
  );
}
