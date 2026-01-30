# Django Settings Configuration

## Configured Settings

### Apps Installed
- **Django default apps**: admin, auth, contenttypes, sessions, messages, staticfiles
- **Third-party apps**:
  - `rest_framework` - REST API framework
  - `corsheaders` - CORS support for React frontend
- **Local apps**:
  - `users` - User management
  - `routes` - Route management

### Database
- **Type**: SQLite3
- **Location**: `backend/db.sqlite3`
- **Auto-created on first migration**

### CORS Configuration
Allows requests from React frontend:
- `http://localhost:5173`
- `http://127.0.0.1:5173`

### REST Framework
- **Authentication**: JWT (JSON Web Token) + Session
- **Permissions**: AllowAny (for development)
- **Pagination**: 20 items per page

### JWT Authentication
- **Access token lifetime**: 1 day
- **Refresh token lifetime**: 7 days
- **Header type**: Bearer

### Media Files (Image Uploads)
- **URL**: `/media/`
- **Directory**: `backend/media/`
- **Auto-served in development mode**

### API Endpoints Structure
- `/admin/` - Django admin panel
- `/api/auth/token/` - Get JWT token (login)
- `/api/auth/token/refresh/` - Refresh JWT token
- `/api/users/` - User endpoints (to be created)
- `/api/routes/` - Route endpoints (to be created)

## Environment Variables (Optional)

Create `.env` file from `.env.example`:
```
SECRET_KEY=your-secret-key-here
DEBUG=True
GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here
```

## Security Notes

⚠️ **For Development Only**:
- DEBUG mode is enabled
- AllowAny permissions on API
- SECRET_KEY is hardcoded

⚠️ **Before Production**:
- Set DEBUG=False
- Use environment variables for SECRET_KEY
- Configure proper permissions on API endpoints
- Add HTTPS
- Update ALLOWED_HOSTS

## How to Run

1. Activate virtual environment:
   ```bash
   source venv/bin/activate
   ```

2. Run migrations:
   ```bash
   python manage.py migrate
   ```

3. Create superuser (optional):
   ```bash
   python manage.py createsuperuser
   ```

4. Start development server:
   ```bash
   python manage.py runserver
   ```

Server runs at: http://localhost:8000
