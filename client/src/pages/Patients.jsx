import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { clinicsAPI, appointmentsAPI } from '../api';

export default function Doctors() {
  const { user } = useAuth();
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingData, setBookingData] = useState({ date: '', time: '', notes: '' });

  useEffect(() => {
    fetchClinics();
  }, []);

  const fetchClinics = async () => {
    try {
      setLoading(true);
      const data = await clinicsAPI.getAll();
      setClinics(data || []);
    } catch (err) {
      setError('Failed to load clinics and doctors');
      console.error('Error fetching clinics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = (doctor, clinicId) => {
    if (!user) {
      alert('Please login to book an appointment');
      return;
    }
    if (user.role !== 'patient') {
      alert('Only patients can book appointments');
      return;
    }
    const fullClinic = clinics.find(c => c.id === clinicId);
    if (!fullClinic) {
      alert('Clinic not found');
      return;
    }
    setSelectedDoctor(doctor);
    setSelectedClinic(fullClinic);
    setShowBookingForm(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      await appointmentsAPI.create({
        doctor_id: selectedDoctor.id,
        clinic_id: selectedClinic.id,
        date: bookingData.date,
        time: bookingData.time,
        notes: bookingData.notes
      });
      alert('Appointment booked successfully!');
      setShowBookingForm(false);
      setBookingData({ date: '', time: '', notes: '' });
    } catch (err) {
      alert('Failed to book appointment: ' + err.message);
      console.error('Booking error:', err);
    }
  };

  const allDoctors = clinics.flatMap(clinic =>
    (clinic.doctors || []).map(doctor => ({
      ...doctor,
      clinicName: clinic.name,
      clinicId: clinic.id
    }))
  );

  const filteredDoctors = allDoctors.filter(doctor =>
    !selectedClinic || doctor.clinicId === selectedClinic.id
  );

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#2563eb', fontSize: '2.5rem', marginBottom: '10px' }}>Our Doctors</h1>
        <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>Meet our team of healthcare professionals across all clinics</p>
      </div>

      {error && <div style={{ padding: '15px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', marginBottom: '20px', textAlign: 'center' }}>{error}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', fontSize: '1.1rem', color: '#6b7280' }}>Loading doctors...</div>
      ) : (
        <>
          {/* Clinic Filter */}
          <div style={{ marginBottom: '30px', textAlign: 'center' }}>
            <select
              onChange={(e) => {
                const value = e.target.value;
                setSelectedClinic(value ? clinics.find(c => c.id === parseInt(value, 10)) : null);
              }}
              style={{ padding: '10px 15px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '1rem', minWidth: '200px' }}
            >
              <option value="">All Clinics</option>
              {clinics.map(clinic => <option key={clinic.id} value={clinic.id}>{clinic.name}</option>)}
            </select>
          </div>

          {/* Doctors Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {filteredDoctors.map(doctor => (
              <div key={`${doctor.id}-${doctor.clinicId}`} style={{ padding: '25px', background: 'white', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #2563eb, #3b82f6)', borderRadius: '50%', margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {doctor.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 style={{ marginBottom: '10px' }}>{doctor.name}</h3>
                <p style={{ color: '#6b7280', marginBottom: '5px' }}>Medical Professional</p>
                <p style={{ color: '#2563eb', fontSize: '0.9rem', marginBottom: '10px' }}>{doctor.clinicName}</p>
                <button
                  onClick={() => handleBookAppointment(doctor, doctor.clinicId)}
                  disabled={user?.role !== 'patient'}
                  style={{
                    marginTop: '15px',
                    padding: '10px 20px',
                    background: user?.role === 'patient' ? '#2563eb' : '#9ca3af',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: user?.role === 'patient' ? 'pointer' : 'not-allowed',
                    opacity: user?.role === 'patient' ? 1 : 0.6
                  }}
                >
                  {user?.role === 'patient' ? 'Book Appointment' : 'View Details'}
                </button>
              </div>
            ))}
          </div>

          {filteredDoctors.length === 0 && <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}><h3>No doctors found</h3><p>No doctors available for the selected clinic.</p></div>}
        </>
      )}

      {/* Booking Modal */}
      {showBookingForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '500px' }}>
            <h3 style={{ marginBottom: '20px', color: '#2563eb' }}>Book Appointment with {selectedDoctor.name}</h3>
            <form onSubmit={handleBookingSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Date:</label>
                <input type="date" required value={bookingData.date} onChange={(e) => setBookingData({...bookingData, date: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '5px' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Time:</label>
                <input type="time" required value={bookingData.time} onChange={(e) => setBookingData({...bookingData, time: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '5px' }} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Notes (Optional):</label>
                <textarea value={bookingData.notes} onChange={(e) => setBookingData({...bookingData, notes: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '5px', minHeight: '80px' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ flex: 1, padding: '12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Book Appointment</button>
                <button type="button" onClick={() => setShowBookingForm(false)} style={{ padding: '12px 20px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
