import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, X, Calendar, Users, Stethoscope, Activity } from 'lucide-react';
import { appointmentsAPI, usersAPI, clinicsAPI } from '../api';


export default function Dashboard() {
  const { user, isAuthenticated } = useAuth(); // Assuming isAuthenticated comes from context
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    totalPatients: 0,
    totalDoctors: 0
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleAuth = () => {
    if (isAuthenticated) {
      // handle sign out
      console.log("Signed out");
    } else {
      // navigate to sign in page
      navigate("/signin");
    }
  };


  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch appointments based on role
      const appointmentsData = await appointmentsAPI.getAll();
      let appointments = appointmentsData || [];

      // Filter appointments by role for security/usability
      if (user?.role === 'patient') {
        appointments = appointments.filter(a => a.patient_id === user.id);
      } else if (user?.role === 'doctor') {
        appointments = appointments.filter(a => a.doctor_id === user.id);
      }
      // For admin, keep all appointments
      
      // Fetch users if admin
      let usersData = [];
      if (user?.role === 'admin') {
        usersData = await usersAPI.getAll();
      }
      
      // Fetch clinics for doctor context
      let clinicsData = [];
      if (user?.role === 'doctor') {
        clinicsData = await clinicsAPI.getAll();
      }

      // Calculate stats based on role (using filtered appointments)
      let statsData = {
        totalAppointments: appointments.length,
        pendingAppointments: appointments.filter(a => a.status === 'scheduled').length,
        totalPatients: 0,
        totalDoctors: 0
      };

      if (user?.role === 'admin') {
        statsData.totalPatients = usersData.filter(u => u.role === 'patient').length;
        statsData.totalDoctors = usersData.filter(u => u.role === 'doctor').length;
      } else if (user?.role === 'doctor') {
        // For doctors, count their unique patients from filtered appointments
        const doctorPatients = new Set(appointments.map(a => a.patient_id).filter(id => id)); // Filter out undefined
        statsData.totalPatients = doctorPatients.size;
        
        // Count doctors in all clinics (system-wide; adjust if clinic-specific needed)
        const clinicDoctors = clinicsData.flatMap(c => (c.doctors || []).map(d => d.id));
        statsData.totalDoctors = new Set(clinicDoctors).size;
      }

      // Get recent appointments (last 5, from filtered data)
      const recent = appointments
        .sort((a, b) => {
          const dateTimeB = new Date(b.date + 'T' + (b.time ?? '')) ?? new Date(0);
          const dateTimeA = new Date(a.date + 'T' + (a.time ?? '')) ?? new Date(0);
          return dateTimeB - dateTimeA;
        })
        .slice(0, 5);

      setStats(statsData);
      setRecentAppointments(recent);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div style={{
      background: 'white',
      padding: '25px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      textAlign: 'center'
    }}>
      <div style={{
        width: '50px',
        height: '50px',
        background: color + '20',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 15px',
        color: color
      }}>
        <Icon size={24} />
      </div>
      <h3 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 5px 0', color: '#1f2937' }}>
        {value}
      </h3>
      <p style={{ color: '#6b7280', margin: 0 }}>{title}</p>
    </div>
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const timeDate = new Date(`2000-01-01T${timeString}`);
    return isNaN(timeDate.getTime()) ? 'Invalid Time' : timeDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  
  if (loading) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', color: '#6b7280' }}>
        Loading dashboard...
      </div>
    );
  }

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
          {/* Mobile menu toggle */}
          <div className="menu-toggle" onClick={toggleMenu}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </div>
        </div>
      </div>
    </nav>
  );
}