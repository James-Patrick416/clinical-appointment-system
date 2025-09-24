// src/components/Navbar.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">HealthCare</Link>

                {/* Desktop Menu */}
                <div className="navbar-links">
                    {user ? (
                        <>
                            <Link to="/dashboard" className="nav-item">Dashboard</Link>
                            {user.role === 'patient' && (
                                <Link to="/appointments" className="nav-item">My Appointments</Link>
                            )}
                            {user.role === 'doctor' && (
                                <Link to="/appointments" className="nav-item">Patient Appointments</Link>
                            )}
                            {user.role === 'clinic_admin' && (
                                <>
                                    <Link to="/admin/doctors" className="nav-item">Manage Doctors</Link> 
                                    {/* The old /patients link is intentionally removed/redirected for this single-focus CRUD page */}
                                    <Link to="/appointments" className="nav-item">Manage Appointments</Link>
                                </>
                            )}
                            <div className="user-info">
                                <User size={20} className="user-icon" />
                                <span>{user.name}</span>
                            </div>
                            <button onClick={logout} className="logout-btn">
                                <LogOut size={20} /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/" className="nav-item">Home</Link>
                            <Link to="/doctors" className="nav-item">Doctors</Link>
                            <Link to="/login" className="nav-button">Login</Link>
                            <Link to="/register" className="nav-button nav-button-secondary">Register</Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="mobile-menu-button" onClick={toggleMenu}>
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`}>
                <div className="mobile-menu-items">
                    {user ? (
                        <>
                            <div className="mobile-user-info">
                                <User size={24} />
                                <span>{user.name}</span>
                            </div>
                            <Link to="/dashboard" className="mobile-nav-item" onClick={toggleMenu}>Dashboard</Link>
                            {user.role === 'patient' && (
                                <Link to="/appointments" className="mobile-nav-item" onClick={toggleMenu}>My Appointments</Link>
                            )}
                            {user.role === 'doctor' && (
                                <Link to="/appointments" className="mobile-nav-item" onClick={toggleMenu}>Patient Appointments</Link>
                            )}
                            {user.role === 'clinic_admin' && (
                                <>
                                    <Link to="/admin/doctors" className="mobile-nav-item" onClick={toggleMenu}>Manage Doctors</Link>
                                    <Link to="/appointments" className="mobile-nav-item" onClick={toggleMenu}>Manage Appointments</Link>
                                </>
                            )}
                            <button onClick={() => { logout(); toggleMenu(); }} className="mobile-logout-btn">
                                <LogOut size={20} /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/" className="mobile-nav-item" onClick={toggleMenu}>Home</Link>
                            <Link to="/doctors" className="mobile-nav-item" onClick={toggleMenu}>Doctors</Link>
                            <Link to="/login" className="mobile-nav-button" onClick={toggleMenu}>Login</Link>
                            <Link to="/register" className="mobile-nav-button" onClick={toggleMenu}>Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;