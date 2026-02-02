import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import './styles/auth.css';
import './styles/home.css';
import './styles/layout.css';
import './styles/routes.css';
import './styles/routeDetail.css';
import './styles/routeForm.css';
import './styles/locations.css';
import './styles/images.css';
import './styles/comments.css';
import './styles/profile.css';

// Layout
import Layout from './components/layout/Layout';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import RoutesListPage from './pages/RoutesListPage';
import RouteDetailPage from './pages/RouteDetailPage';
import CreateRoutePage from './pages/CreateRoutePage';
import EditRoutePage from './pages/EditRoutePage';
import ProfilePage from './pages/ProfilePage';
import UserProfilePage from './pages/UserProfilePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes with Layout (Header + Footer) */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/routes" element={<RoutesListPage />} />
          <Route path="/routes/:id" element={<RouteDetailPage />} />

          {/* Protected routes - require authentication */}
          <Route
            path="/routes/create"
            element={
              <ProtectedRoute>
                <CreateRoutePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/routes/:id/edit"
            element={
              <ProtectedRoute>
                <EditRoutePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Public user profile route */}
          <Route path="/users/:id" element={<UserProfilePage />} />
        </Route>

        {/* Routes without Layout (Auth pages - full screen) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
