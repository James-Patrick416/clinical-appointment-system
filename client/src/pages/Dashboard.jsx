import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { appointmentsAPI, usersAPI, clinicsAPI } from '../api';
import { Calendar, Users, Stethoscope, Activity } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    totalPatients: 0,
    totalDoctors: 0
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch appointments based on role
      const appointmentsData = await appointmentsAPI.getAll();
      const appointments = appointmentsData || [];
      
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

      // Calculate stats based on role
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
        // For doctors, count their unique patients
        const doctorPatients = new Set(appointments.map(a => a.patient_id));
        statsData.totalPatients = doctorPatients.size;
        
        // Count doctors in their clinics
        const clinicDoctors = clinicsData.flatMap(c => c.doctors);
        statsData.totalDoctors = new Set(clinicDoctors.map(d => d.id)).size;
      }

      // Get recent appointments (last 5)
      const recent = appointments
        .sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time))
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
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
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
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
      {/* Welcome Section */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ color: '#2563eb', fontSize: '2.5rem', marginBottom: '10px' }}>
          Welcome back, {user?.name}!
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>
          {user?.role === 'admin' ? 'System Overview' : 
           user?.role === 'doctor' ? 'Your Medical Practice' : 
           'Your Health Dashboard'}
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px', 
        marginBottom: '40px' 
      }}>
        <StatCard 
          icon={Calendar} 
          title="Total Appointments" 
          value={stats.totalAppointments} 
          color="#2563eb" 
        />
        <StatCard 
          icon={Activity} 
          title="Pending Appointments" 
          value={stats.pendingAppointments} 
          color="#d97706" 
        />
        {(user?.role === 'admin' || user?.role === 'doctor') && (
          <StatCard 
            icon={Users} 
            title="Total Patients" 
            value={stats.totalPatients} 
            color="#16a34a" 
          />
        )}
        {(user?.role === 'admin' || user?.role === 'doctor') && (
          <StatCard 
            icon={Stethoscope} 
            title="Total Doctors" 
            value={stats.totalDoctors} 
            color="#dc2626" 
          />
        )}
      </div>

      {/* Recent Appointments */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginBottom: '20px', color: '#1f2937' }}>Recent Appointments</h2>
        
        {recentAppointments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            <Calendar size={48} style={{ marginBottom: '10px', opacity: 0.5 }} />
            <p>No appointments found</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {recentAppointments.map(appt => (
              <div key={appt.id} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '15px',
                background: '#f8fafc',
                borderRadius: '8px',
                borderLeft: `4px solid ${
                  appt.status === 'completed' ? '#16a34a' : 
                  appt.status === 'cancelled' ? '#dc2626' : '#d97706'
                }`
              }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 5px 0', color: '#1f2937' }}>
                    {user?.role === 'doctor' ? `Patient: ${appt.patient_name}` : `Dr. ${appt.doctor_name}`}
                  </h4>
                  <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>
                    {formatDate(appt.date)} at {formatTime(appt.time)} • {appt.clinic_name}
                  </p>
                </div>
                <span style={{
                  padding: '4px 12px',
                  background: appt.status === 'completed' ? '#dcfce7' : 
                             appt.status === 'cancelled' ? '#fef2f2' : '#fffbeb',
                  color: appt.status === 'completed' ? '#16a34a' : 
                         appt.status === 'cancelled' ? '#dc2626' : '#d97706',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  textTransform: 'capitalize'
                }}>
                  {appt.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <h3 style={{ marginBottom: '20px', color: '#1f2937' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button style={{
            padding: '12px 24px',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}>
            View Appointments
          </button>
          
          {user?.role === 'patient' && (
            <button style={{
              padding: '12px 24px',
              background: '#16a34a',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}>
              Book Appointment
            </button>
          )}
          
          {(user?.role === 'admin' || user?.role === 'doctor') && (
            <button style={{
              padding: '12px 24px',
              background: '#d97706',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}>
              Manage Patients
            </button>
          )}
        </div>
      </div>
    </div>
  );
}