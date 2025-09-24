import React, { useState } from 'react';
import { Search, Calendar, MessageCircle, Heart, Activity, Pill, Star, Download, Menu, X } from 'lucide-react';
import './LandingPage.css';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const doctors = [
    { name: "Dr. Linda", specialty: "Medicine Specialist", rating: 4.9, color: "blue" },
    { name: "Dr. Alisa", specialty: "Cardiology Specialist", rating: 4.8, color: "red" },
    { name: "Dr. Antony", specialty: "Neurology Specialist", rating: 4.9, color: "purple" },
    { name: "Dr. Khalid", specialty: "Cancer Specialist", rating: 4.7, color: "green" }
  ];

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container container">
          <Link to="/" className="logo-text">HealthCare</Link>
          <div className="nav-menu">
            <div className="nav-links">
              <a href="#home" className="nav-link active">Home</a>
              <a href="#services" className="nav-link">Services</a>
              <a href="#doctors" className="nav-link">Doctors</a>
              <a href="#about" className="nav-link">About</a>
            </div>
            <Link to="/login" className="nav-btn">
              Book Appointment
            </Link>
          </div>
          <button className="mobile-menu-btn" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          <a href="#home" className="mobile-link active" onClick={toggleMenu}>Home</a>
          <a href="#services" className="mobile-link" onClick={toggleMenu}>Services</a>
          <a href="#doctors" className="mobile-link" onClick={toggleMenu}>Doctors</a>
          <a href="#about" className="mobile-link" onClick={toggleMenu}>About</a>
          <Link to="/login" className="mobile-btn" onClick={toggleMenu}>
            Book Appointment
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="container">
          <div className="hero-grid">
            {/* Left side: content */}
            <div className="hero-content">
              <h1 className="hero-title">
                Find And Search Your
                <span className="hero-title-accent">Suitable Doctor's</span>
              </h1>
              <p className="hero-description">
                Join us and take care of yourself and your family with health services 
                that will make you feel confident and safe in your daily life.
              </p>
              <div className="hero-buttons">
                <Link to="/doctors" className="btn-primary">
                  Find A Doctor
                </Link>
                <a href="#about" className="btn-secondary">
                  Learn More
                </a>
              </div>
            </div>

            {/* Right side: real image instead of placeholder */}
            <div className="hero-image">
              <div className="image-card">
                <div className="image-content">
                  <img
                    src="/doctor2.jpeg"
                    alt="Doctor"
                    className="hero-real-image"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="steps-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">3 Easy Steps and Get Your Solution</h2>
            <p className="section-description">
              Find your doctor easily with a minimum of effort. We've kept everything organised for you.
            </p>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-icon blue"><Search size={40} /></div>
              <h3 className="step-title">Find Best Doctors</h3>
              <p className="step-description">
                Find your doctor easily with a minimum of effort. We've kept everything organised for you.
              </p>
            </div>
            <div className="step-card">
              <div className="step-icon green"><Calendar size={40} /></div>
              <h3 className="step-title">Get Appointment</h3>
              <p className="step-description">
                Ask for an appointment of the doctor quickly with almost a single click. We take care of the rest.
              </p>
            </div>
            <div className="step-card">
              <div className="step-icon purple"><MessageCircle size={40} /></div>
              <h3 className="step-title">Happy Consultations</h3>
              <p className="step-description">
                Do consultations and take the service based on your appointment. Get back to good health.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Service Section */}
      <section className="quality-section">
        <div className="container">
          <div className="quality-grid">
            {/* Left side: real image instead of placeholder */}
            <div className="quality-image">
              <div className="quality-card">
                <div className="quality-content">
                  <img 
                    src="/doctor1.jpeg"
                    alt="Quality healthcare service"
                    className="quality-real-image"
                  />
                </div>
              </div>
            </div>
            {/* Right side: text */}
            <div className="quality-text">
              <h2 className="quality-title">
                Best quality service with our experienced doctors
              </h2>
              <p className="quality-description">
                With our top doctors, we are able to provide best medical services above average. 
                We have highly experienced doctors, so don't worry. They are also very talented in their fields.
              </p>
              <ul className="quality-list">
                <li>Search your specialist & Online consultations anywhere</li>
                <li>Consultation our top specialists</li>
                <li>Doctors are available 24/7</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Services</h2>
            <p className="section-description">
              Our doctors have high qualified skills and are guaranteed to help you recover from your disease.
            </p>
          </div>
          <div className="services-grid">
            <div className="service-card red">
              <div className="service-icon red"><Heart size={32} /></div>
              <h3 className="service-title">Cardiology</h3>
              <p className="service-description">Skilled in diagnosing and treating cardiovascular system diseases.</p>
            </div>
            <div className="service-card blue">
              <div className="service-icon blue"><Activity size={32} /></div>
              <h3 className="service-title">Pulmonology</h3>
              <p className="service-description">Skilled in diagnosing and treating respiratory system diseases.</p>
            </div>
            <div className="service-card green">
              <div className="service-icon green"><Pill size={32} /></div>
              <h3 className="service-title">Medicine</h3>
              <p className="service-description">Skilled in diagnosing and treating diseases with the latest medicine systems.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section id="doctors" className="doctors-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Meet Our Certified Online Doctors</h2>
            <p className="section-description">Our online doctors have an average of 15 years experience and a 98% satisfaction rating.</p>
          </div>
          <div className="doctors-grid">
            {doctors.map((doctor, index) => (
              <div key={index} className="doctor-card">
                <div className={`doctor-avatar ${doctor.color}`}>
                  {doctor.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="doctor-name">{doctor.name}</h3>
                <p className="doctor-specialty">{doctor.specialty}</p>
                <div className="doctor-rating">
                  <Star size={16} fill="currentColor" />
                  <span>{doctor.rating}</span>
                </div>
                <Link to="/login" className="doctor-btn">Book Now</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile App Section */}
      <section className="app-section">
        <div className="container">
          <div className="app-grid">
            <div className="app-content">
              <h2 className="app-title">Mobile apps are available <span className="app-title-accent">Get HealthCare for free!</span></h2>
              <p className="app-description">Get on-demand access to a doctor on your phone with the free HealthCare mobile app.</p>
              <div className="app-buttons">
                <button className="app-btn"><Download size={20} /> App Store</button>
                <button className="app-btn"><Download size={20} /> Google Play</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">It's Time... Change Your Life</h2>
            <p className="cta-description">Start your journey to better health today with our expert medical team and cutting-edge technology.</p>
            <Link to="/register" className="cta-btn">Get Started Now</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;