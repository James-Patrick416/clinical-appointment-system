import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../api';

export default function Patients() {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'doctor') {
      fetchPatients();
    }
  }, [user]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const data = await usersAPI.getAll();
      // Filter to show only patients for doctors, all users for admins
      const filteredPatients = user?.role === 'doctor' 
        ? data.filter(u => u.role === 'patient')
        : data;
      setPatients(filteredPatients || []);
    } catch (err) {
      setError('Failed to load patients');
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return '#dc2626';
      case 'doctor': return '#2563eb';
      case 'patient': return '#16a34a';
      default: return '#6b7280';
    }
  };

  if (user?.role !== 'admin' && user?.role !== 'doctor') {
    return (
      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
        <div style={{ textAlign: 'center', marginTop: '40px', color: '#6b7280' }}>
          <h2 style={{ color: '#dc2626', marginBottom: '10px' }}>Access Denied</h2>
          <p>Patient management is only available for doctors and administrators.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#2563eb', fontSize: '2.5rem', marginBottom: '10px' }}>
          {user?.role === 'admin' ? 'User Management' : 'Your Patients'}
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>
          {user?.role === 'admin' ? 'Manage all system users' : 'View and manage your patients'}
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
          Loading patients...
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Name</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Email</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Role</th>
                {user?.role === 'admin' && (
                  <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>ID</th>
                )}
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.length === 0 ? (
                <tr>
                  <td colSpan={user?.role === 'admin' ? 5 : 4} style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                    {user?.role === 'doctor' ? 'No patients found' : 'No users found'}
                  </td>
                </tr>
              ) : (
                patients.map(patient => (
                  <tr key={patient.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '15px', fontWeight: '500' }}>{patient.name}</td>
                    <td style={{ padding: '15px' }}>{patient.email}</td>
                    <td style={{ padding: '15px' }}>
                      <span style={{
                        padding: '4px 8px',
                        background: getRoleBadgeColor(patient.role) + '20',
                        color: getRoleBadgeColor(patient.role),
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        textTransform: 'capitalize'
                      }}>
                        {patient.role}
                      </span>
                    </td>
                    {user?.role === 'admin' && (
                      <td style={{ padding: '15px', fontFamily: 'monospace', color: '#6b7280' }}>
                        #{patient.id}
                      </td>
                    )}
                    <td style={{ padding: '15px' }}>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button style={{
                          padding: '6px 12px',
                          background: '#2563eb',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}>
                          View Details
                        </button>
                        {user?.role === 'admin' && patient.role !== 'admin' && (
                          <button style={{
                            padding: '6px 12px',
                            background: '#dc2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}>
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {user?.role === 'admin' && (
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <button style={{
            padding: '12px 24px',
            background: '#16a34a',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold'
          }}>
            + Add New User
          </button>
        </div>
      )}
    </div>
  );
}