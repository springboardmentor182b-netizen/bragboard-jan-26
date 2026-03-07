import axios from 'axios';
import { config } from '../config/env';

const api = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request automatically
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('token');
  if (token) {
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

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

// ── Admin endpoints ─────────────────────────────────────────────────────
export const adminAPI = {
  // Analytics
  getAnalytics: () => api.get('/admin/analytics'),

  // User Management
  getUsers: () => api.get('/admin/users'),
  updateUserRole: (userId, role) => api.put(`/admin/users/${userId}/role`, { role }),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),

  // Moderation
  getFlaggedShoutouts: () => api.get('/admin/moderation'),
  getAllShoutouts: () => api.get('/admin/moderation/all'),
  flagShoutout: (id) => api.put(`/admin/shoutouts/${id}/flag`),
  unflagShoutout: (id) => api.put(`/admin/shoutouts/${id}/unflag`),
  deleteShoutout: (id) => api.delete(`/admin/shoutouts/${id}`),

  // Audit Logs
  getLogs: (limit = 50) => api.get(`/admin/logs?limit=${limit}`),
};

export default api;
