# MotoRoutes API Endpoints

Base URL: `http://localhost:8000/api/`

## Authentication Endpoints

### Get JWT Token (Login)
```
POST /api/auth/token/
```
**Body:**
```json
{
  "username": "user123",
  "password": "password"
}
```
**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbG...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbG..."
}
```

### Refresh JWT Token
```
POST /api/auth/token/refresh/
```
**Body:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbG..."
}
```

---

## User Endpoints

### Register New User
```
POST /api/users/register/
```
**Body:**
```json
{
  "username": "rider123",
  "email": "rider@example.com",
  "password": "securepass123",
  "password2": "securepass123",
  "first_name": "John",
  "last_name": "Doe"
}
```

### Get User Profile (Authenticated)
```
GET /api/users/profile/
Headers: Authorization: Bearer <token>
```

### Update User Profile (Authenticated)
```
PUT/PATCH /api/users/profile/
Headers: Authorization: Bearer <token>
```
**Body:**
```json
{
  "bio": "Love riding motorcycles!",
  "motorcycle_brand": "Harley-Davidson",
  "motorcycle_model": "Street Glide",
  "motorcycle_year": 2022
}
```

### List All Users
```
GET /api/users/
```

### Get User by ID
```
GET /api/users/<id>/
```

---

## Route Endpoints

### List All Routes
```
GET /api/routes/
```
**Response:** Paginated list of routes (lightweight)

### Create New Route (Authenticated)
```
POST /api/routes/
Headers: Authorization: Bearer <token>
```
**Body:**
```json
{
  "title": "Pacific Coast Highway",
  "description": "Stunning coastal ride",
  "difficulty": "moderate",
  "distance": 250.5,
  "geojson": {
    "type": "LineString",
    "coordinates": [
      [-122.4194, 37.7749],
      [-122.4084, 37.7849]
    ]
  }
}
```

### Get Route Details
```
GET /api/routes/<id>/
```
**Response:** Full route details with locations, images, comments

### Update Route (Authenticated, Creator Only)
```
PUT/PATCH /api/routes/<id>/
Headers: Authorization: Bearer <token>
```

### Delete Route (Authenticated, Creator Only)
```
DELETE /api/routes/<id>/
Headers: Authorization: Bearer <token>
```

### Get Routes by User
```
GET /api/routes/user/<user_id>/
```

### Get Route Locations
```
GET /api/routes/<route_id>/locations/
```

### Get Route Comments
```
GET /api/routes/<route_id>/comments/
```

---

## Location (POI) Endpoints

### List All Locations
```
GET /api/routes/locations/
```

### Create New Location (Authenticated)
```
POST /api/routes/locations/
Headers: Authorization: Bearer <token>
```
**Body:**
```json
{
  "name": "Mountain View Point",
  "description": "Amazing panoramic views",
  "location_type": "viewpoint",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "route": 1
}
```

**Location Types:**
- `gas_station`
- `restaurant`
- `viewpoint`
- `hotel`
- `rest_area`
- `attraction`
- `parking`
- `other`

### Get Location Details
```
GET /api/routes/locations/<id>/
```

### Update Location (Authenticated)
```
PUT/PATCH /api/routes/locations/<id>/
Headers: Authorization: Bearer <token>
```

### Delete Location (Authenticated)
```
DELETE /api/routes/locations/<id>/
Headers: Authorization: Bearer <token>
```

---

## Image Endpoints

### List All Images
```
GET /api/routes/images/
```

### Upload Image (Authenticated)
```
POST /api/routes/images/
Headers: Authorization: Bearer <token>
Content-Type: multipart/form-data
```
**Body:**
```
image: <file>
caption: "Beautiful sunset"
route: 1 (optional)
location: 2 (optional)
```

### Get Image Details
```
GET /api/routes/images/<id>/
```

### Delete Image (Authenticated)
```
DELETE /api/routes/images/<id>/
Headers: Authorization: Bearer <token>
```

---

## Comment Endpoints

### List All Comments
```
GET /api/routes/comments/
```

### Create Comment (Authenticated)
```
POST /api/routes/comments/
Headers: Authorization: Bearer <token>
```
**Body:**
```json
{
  "text": "Great route! Highly recommended.",
  "route": 1
}
```

### Get Comment Details
```
GET /api/routes/comments/<id>/
```

### Update Comment (Authenticated)
```
PUT/PATCH /api/routes/comments/<id>/
Headers: Authorization: Bearer <token>
```

### Delete Comment (Authenticated)
```
DELETE /api/routes/comments/<id>/
Headers: Authorization: Bearer <token>
```

---

## Difficulty Levels

Routes can have the following difficulty levels:
- `easy` - Easy
- `moderate` - Moderate
- `hard` - Hard
- `expert` - Expert

---

## Pagination

List endpoints return paginated results:
```json
{
  "count": 100,
  "next": "http://localhost:8000/api/routes/?page=2",
  "previous": null,
  "results": [...]
}
```

Default page size: 20 items

---

## Testing Endpoints

You can test endpoints using:
- **Browser:** Visit http://localhost:8000/api/routes/
- **Postman/Insomnia:** Import endpoints
- **cURL:** Command line testing
- **Python requests:** Automated testing

### Example cURL:
```bash
# List routes
curl http://localhost:8000/api/routes/

# Login
curl -X POST http://localhost:8000/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"pass"}'

# Create route (with token)
curl -X POST http://localhost:8000/api/routes/ \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Route","description":"Test","difficulty":"easy","distance":10,"geojson":{"type":"LineString","coordinates":[[0,0],[1,1]]}}'
```
