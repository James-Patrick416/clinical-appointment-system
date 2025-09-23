import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";


export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // auth state

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleAuth = () => {
    if (isAuthenticated) {
      // handle sign out
      setIsAuthenticated(false);
      console.log("Signed out");
    } else {
      // navigate to sign in page
      // you can use a router navigation instead of alert
      window.location.href = "/signin";
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-content">
          {/* Logo */}
          <div className="nav-logo">
            <Link to="/">
              <img src="/logo1.jpeg" alt="HealthCare Logo" className="logo-img" />

            </Link>
          </div>

          {/* Desktop Menu */}
          <div className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
            <div className="nav-links">
              {/* landing page sections */}
              <a href="#home" className="nav-link active">Home</a>
              <a href="#services" className="nav-link">Services</a>
              <a href="#doctors" className="nav-link">Doctors</a>
              <a href="#about" className="nav-link">About</a>

              {/* Auth button */}
              <button onClick={handleAuth} className="nav-btn">
                {isAuthenticated ? "Sign Out" : "Sign In"}
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="mobile-menu-btn">
            <button onClick={toggleMenu} className="menu-toggle">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
