# MotoRoutes

A web platform for motorcyclists to share and discover motorcycle routes.

## Project Structure

```
MotoRoutes/
├── backend/           # Django REST API
│   ├── motoroutes/   # Main Django project
│   ├── routes/       # Routes app
│   ├── users/        # Users app
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/         # React app
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   └── utils/
    ├── package.json
    └── .env.example
```

## Setup Instructions

### Backend (Django)

1. Navigate to backend folder:
   ```bash
   cd backend
   ```

2. Create virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create `.env` file from example:
   ```bash
   cp .env.example .env
   ```

5. Run migrations:
   ```bash
   python manage.py migrate
   ```

6. Start development server:
   ```bash
   python manage.py runserver
   ```

Backend will run at: http://localhost:8000

### Frontend (React)

1. Navigate to frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file from example:
   ```bash
   cp .env.example .env
   ```

4. Add your Google Maps API key to `.env`

5. Start development server:
   ```bash
   npm run dev
   ```

Frontend will run at: http://localhost:5173

## Tech Stack

- **Backend:** Django 6.0, Django REST Framework, SQLite
- **Frontend:** React, Vite, React Router, Axios
- **Maps:** Google Maps API
- **Images:** Pillow (Django)

## Next Steps

- Configure Django settings for REST API
- Create database models
- Build API endpoints
- Create React components and pages
