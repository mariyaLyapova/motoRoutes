import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="logo">
            <span className="logo-text">MotoRoutes</span>
          </Link>

          <nav className="nav-links">
            <Link to="/routes" className="nav-link">Routes</Link>
            <Link to="/locations" className="nav-link">Locations</Link>
          </nav>
        </div>

        <div className="header-right">
          {user ? (
            <div className="user-menu">
              <Link to="/routes/create" className="btn-create">
                Create Route
              </Link>
              <Link to="/profile" className="user-link">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.username} 
                    className="user-avatar"
                  />
                ) : (
                  <svg 
                    className="user-icon" 
                    fill="currentColor" 
                    viewBox="0 0 20 20" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="user-name">{user.username}</span>
              </Link>
              <button onClick={logout} className="btn-logout">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/register" className="btn-register">Register</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
