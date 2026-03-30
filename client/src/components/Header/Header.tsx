import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "./Header.scss";

const navLinks = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/programs", label: "Program" },
  { path: "/exercises", label: "Övningar" },
  { path: "/profile", label: "Profil" },
];

/**
 * Header Component
 * Handles global navigation and displays user session information.
 */
function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const username = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    closeMenu();
  };

  // If no token exists, the user is not logged in, do not render the header.
  if (!token) return null;

  return (
    <header className="main-header">
      <div className="header-inner">
        {/* Top row with Logo and Burger Toggle */}
        <div className="header-top-row">
          <Link to="/dashboard" className="logo" onClick={closeMenu}>
            FOUNDATION
          </Link>

          <button
            className={`menu-toggle ${isMenuOpen ? "is-active" : ""}`}
            onClick={toggleMenu}
            aria-label="Meny"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Collapsible content */}
        <div className={`header-content ${isMenuOpen ? "is-open" : ""}`}>
          <nav className="main-nav">
            {navLinks.map(
              (
                { path, label },
              ) => (
                <Link
                  key={path}
                  to={path}
                  className={`nav-link ${pathname === path ? "active" : ""}`}
                  onClick={closeMenu}
                >
                  {label}
                </Link>
              ),
            )}

            <Link to="#" className="nav-link disabled" onClick={closeMenu}>
              Statistik
            </Link>
          </nav>

          <div className="nav-info">
            <span className="user-badge">
              Inloggad: <strong>{username}</strong>
            </span>
            <button onClick={handleLogout} className="logout-link">
              Logga ut
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
