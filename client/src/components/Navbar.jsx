import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // or from "react-icons/fi"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      {/* Navigation */}
      <div className="nav-container">
        <div className="nav-content">
          {/* Logo */}
          <div className="nav-logo">
            <h1 className="logo-text">HealthCare</h1>
          </div>

          {/* Desktop Menu */}
          <div className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
            <div className="nav-links">
              <Link to="/" className="nav-link active">Home</Link>
              <Link to="/services" className="nav-link">Services</Link>
              <Link to="/doctors" className="nav-link">Doctors</Link>
              <Link to="/about" className="nav-link">About</Link>
              <button className="nav-btn">Book Appointment</button>
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
