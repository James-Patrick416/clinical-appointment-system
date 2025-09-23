const API_BASE = 'http://localhost:5000/api';

// Helper function for API calls
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: (email, password) => 
    apiRequest('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (userData) =>
    apiRequest('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
};

// Users API
export const usersAPI = {
  getAll: () => apiRequest('/users'),
  getById: (id) => apiRequest(`/users/${id}`),
  update: (id, userData) =>
    apiRequest(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    }),
  delete: (id) => apiRequest(`/users/${id}`, { method: 'DELETE' }),
};

// Appointments API
export const appointmentsAPI = {
  getAll: () => apiRequest('/appointments'),
  create: (appointmentData) =>
    apiRequest('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    }),
  update: (id, updateData) =>
    apiRequest(`/appointments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    }),
  delete: (id) => apiRequest(`/appointments/${id}`, { method: 'DELETE' }),
};

// Clinics API
export const clinicsAPI = {
  getAll: () => apiRequest('/clinics'),
  create: (clinicData) =>
    apiRequest('/clinics', {
      method: 'POST',
      body: JSON.stringify(clinicData),
    }),
  update: (id, clinicData) =>
    apiRequest(`/clinics/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(clinicData),
    }),
  delete: (id) => apiRequest(`/clinics/${id}`, { method: 'DELETE' }),
  assignDoctor: (clinicId, doctorId) =>
    apiRequest(`/clinics/${clinicId}/doctors/${doctorId}`, {
      method: 'POST',
    }),
  removeDoctor: (clinicId, doctorId) =>
    apiRequest(`/clinics/${clinicId}/doctors/${doctorId}`, {
      method: 'DELETE',
    }),
};

export default {
  auth: authAPI,
  users: usersAPI,
  appointments: appointmentsAPI,
  clinics: clinicsAPI,
};