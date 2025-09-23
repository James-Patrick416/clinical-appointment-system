import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { appointmentsAPI } from '../api';

export default function Appointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentsAPI.getAll();
      // Your backend returns an array directly, not nested under 'appointments'
      setAppointments(data || []);
    } catch (err) {
      setError('Failed to load appointments');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'scheduled': return '#d97706'; // pending color
      case 'completed': return '#16a34a';
      case 'cancelled': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await appointmentsAPI.update(appointmentId, { status: newStatus });
      fetchAppointments(); // Refresh the list
    } catch (err) {
      setError('Failed to update appointment');
      console.error('Error updating appointment:', err);
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#2563eb', fontSize: '2.5rem', marginBottom: '10px' }}>
          {user?.role === 'doctor' ? 'Patient Appointments' : 'Your Appointments'}
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>
          {user?.role === 'doctor' ? 'Manage your patient appointments' : 'Manage and view your scheduled appointments'}
        </p>
      </div>

      {error && (
        <div style={{
          padding: '15px',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          color: '#dc2626',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', fontSize: '1.1rem', color: '#6b7280' }}>
          Loading appointments...
        </div>
      ) : appointments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
          <h3>No appointments found</h3>
          <p>{
            user?.role === 'patient' 
              ? 'You haven\'t booked any appointments yet.' 
              : user?.role === 'doctor'
              ? 'No appointments scheduled for you yet.'
              : 'No appointments in the system.'
          }</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {appointments.map(appt => (
            <div key={appt.id} style={{
              padding: '20px',
              background: 'white',
              borderRadius: '10px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              borderLeft: `4px solid ${getStatusColor(appt.status)}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', color: '#1f2937' }}>
                    {user?.role === 'doctor' ? `Patient: ${appt.patient_name}` : `Dr. ${appt.doctor_name}`}
                  </h3>
                  <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>
                    {appt.clinic_name && `Clinic: ${appt.clinic_name}`}
                  </p>
                </div>
                <span style={{
                  padding: '4px 12px',
                  background: getStatusColor(appt.status) + '20',
                  color: getStatusColor(appt.status),
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  {appt.status?.toUpperCase()}
                </span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                <div>
                  <strong>Date:</strong> {formatDate(appt.date)}
                </div>
                <div>
                  <strong>Time:</strong> {formatTime(appt.time)}
                </div>
                <div>
                  <strong>Reason:</strong> {appt.notes || 'General consultation'}
                </div>
              </div>

              {/* Doctor actions */}
              {user?.role === 'doctor' && appt.status === 'scheduled' && (
                <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => handleStatusUpdate(appt.id, 'completed')}
                    style={{
                      padding: '8px 16px',
                      background: '#16a34a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    Mark Completed
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(appt.id, 'cancelled')}
                    style={{
                      padding: '8px 16px',
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Patient actions */}
              {user?.role === 'patient' && appt.status === 'scheduled' && (
                <div style={{ marginTop: '15px' }}>
                  <button 
                    onClick={() => handleStatusUpdate(appt.id, 'cancelled')}
                    style={{
                      padding: '8px 16px',
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    Cancel Appointment
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}