import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Attach JWT token to every request automatically
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('token');
  if (token) {
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

// Handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired — clear storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth endpoints ──────────────────────────────────────────────────────────
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

// ── Users endpoint ──────────────────────────────────────────────────────────
export const usersAPI = {
  getAll: () => api.get('/users/'),
  getById: (id) => api.get(`/users/${id}`),
};

// ── Shoutouts endpoints ─────────────────────────────────────────────────────
export const shoutoutsAPI = {
  getAll: () => api.get('/shoutouts/'),
  getMine: (userId) => api.get(`/shoutouts/my/${userId}`),
  create: (data) => api.post('/shoutouts/', data),
  like: (id) => api.put(`/shoutouts/${id}/like`),
};

// ── Leaderboard endpoints ───────────────────────────────────────────────────
export const leaderboardAPI = {
  mostAppreciated: (limit = 10) => api.get(`/leaderboard/most-appreciated?limit=${limit}`),
  topContributors: (limit = 10) => api.get(`/leaderboard/top-contributors?limit=${limit}`),
  departments: () => api.get('/leaderboard/departments'),
};

export default api;