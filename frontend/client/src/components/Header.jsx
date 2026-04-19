import { useNavigate, useLocation } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleNavigation = (path, pageName) => {
    console.log(`Navigating to ${pageName}: ${path}`);
    navigate(path);
  };

  return (
    <header className="main-header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo" onClick={() => handleNavigation("/", "Home")}>
          <span className="logo-icon">🔬</span>
          <span className="logo-text">ENSIA<span className="logo-accent">Research</span></span>
        </div>

        {/* Navigation Links */}
        <nav className="nav-links">
          <button 
            className={`nav-link ${isActive("/") ? "active" : ""}`}
            onClick={() => handleNavigation("/", "Home")}
          >
            Home
          </button>
          <button 
            className={`nav-link ${isActive("/ranking") ? "active" : ""}`}
            onClick={() => handleNavigation("/ranking", "Ranking")}
          >
            Ranking
          </button>
          <button 
            className={`nav-link ${isActive("/recommendations") ? "active" : ""}`}
            onClick={() => handleNavigation("/recommendations", "Recommendations")}
          >
            Recommendations
          </button>
          <button 
            className={`nav-link ${isActive("/projects") ? "active" : ""}`}
            onClick={() => handleNavigation("/projects", "Projects")}
          >
            Projects
          </button>
          <button 
            className={`nav-link ${isActive("/papers") ? "active" : ""}`}
            onClick={() => handleNavigation("/papers", "Papers")}
          >
            Papers
          </button>
        </nav>

        {/* Auth Buttons */}
        <div className="auth-buttons">
          <button 
            className="btn-login"
            onClick={() => handleNavigation("/login", "Login")}
          >
            Log in
          </button>
          <button 
            className="btn-signup"
            onClick={() => handleNavigation("/signup", "Signup")}
          >
            Sign up
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}