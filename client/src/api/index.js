// src/api/index.js

// **Important: Ensure this BASE_URL matches your Flask server address.**
const BASE_URL = 'http://localhost:5555';

// Helper function for making authenticated requests
const authenticatedFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API call failed with status ${response.status}`);
    }

    return response.json();
};

export const authAPI = {
    login: (credentials) => authenticatedFetch('/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    }),
    register: (userData) => authenticatedFetch('/register', {
        method: 'POST',
        body: JSON.stringify(userData),
    }),
};

export const usersAPI = {
    getAll: () => authenticatedFetch('/users'),
    // Note: The /register endpoint is used for creating new users (doctors/admins) in the Admin panel
    update: (id, userData) => authenticatedFetch(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
    }),
    delete: (id) => authenticatedFetch(`/users/${id}`, {
        method: 'DELETE',
    }),
};

export const appointmentsAPI = {
    getAll: () => authenticatedFetch('/appointments'),
    create: (appointmentData) => authenticatedFetch('/appointments', {
        method: 'POST',
        body: JSON.stringify(appointmentData),
    }),
    update: (id, appointmentData) => authenticatedFetch(`/appointments/${id}`, {
        method: 'PUT',
        body: JSON.stringify(appointmentData),
    }),
};

export const clinicsAPI = {
    getAll: () => authenticatedFetch('/clinics'),
};