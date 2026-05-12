import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  logout: () => api.post('/auth/logout/'),
  me: () => api.get('/auth/me/'),
};

export const flightAPI = {
  getAll: (params) => api.get('/flights/', { params }),
  getOne: (id) => api.get(`/flights/${id}/`),
  create: (data) => api.post('/flights/', data),
  update: (id, data) => api.put(`/flights/${id}/`, data),
  delete: (id) => api.delete(`/flights/${id}/`),
  getMy: () => api.get('/flights/my/'),
  getPassengers: (id) => api.get(`/flights/${id}/passengers/`),
};

export const aircraftAPI = {
  getAll: () => api.get('/aircrafts/'),
  getMy: () => api.get('/aircrafts/my/'),
  create: (data) => api.post('/aircrafts/', data),
  update: (id, data) => api.put(`/aircrafts/${id}/`, data),
  delete: (id) => api.delete(`/aircrafts/${id}/`),
};

export const bookingAPI = {
  create: (data) => api.post('/bookings/', data),
  getMy: () => api.get('/bookings/my/'),
  getMyFlights: () => api.get('/bookings/my-flights/'),
  delete: (id) => api.delete(`/bookings/${id}/`),
};

export default api;
