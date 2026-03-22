import { useNavigate, Link, useLocation } from 'react-router-dom';
import './Header.scss';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  if (!token) return null;

  return (
    <header className="main-header">
      <div className="header-inner">
        <div className="header-left">
          <Link to="/dashboard" className="logo">
            FOUNDATION
          </Link>
          
          <nav className="main-nav">
            <Link 
              to="/dashboard" 
              className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
            >
              Dashboard
            </Link>
            <Link to="#" className="nav-link disabled">Statistik</Link>
            <Link to="#" className="nav-link disabled">Övningar</Link>
            
            <Link 
              to="/profile" 
              className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
            >
              Profil
            </Link>
          </nav>
        </div>
        
        <div className="nav-info">
          <span className="user-badge">
            Inloggad: <strong>{username}</strong>
          </span>
          <button onClick={handleLogout} className="logout-link">
            Logga ut
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
