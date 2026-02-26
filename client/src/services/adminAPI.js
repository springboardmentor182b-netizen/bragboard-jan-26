import api from './api';

const adminAPI = {
  // ── Analytics ────────────────────────────────────────────────────────────
  getStats: () => api.get('/admin/stats'),
  getTopContributors: (limit = 10) =>
    api.get(`/admin/analytics/top-contributors?limit=${limit}`),
  getMostAppreciated: (limit = 10) =>
    api.get(`/admin/analytics/most-appreciated?limit=${limit}`),
  getDepartmentStats: () => api.get('/admin/analytics/departments'),

  // ── User Management ───────────────────────────────────────────────────────
  listUsers: () => api.get('/admin/users'),
  changeUserRole: (userId, role) =>
    api.patch(`/admin/users/${userId}/role`, { role }),

  // ── Moderation ────────────────────────────────────────────────────────────
  listShoutouts: (limit = 50) =>
    api.get(`/admin/shoutouts?limit=${limit}`),
  deleteShoutout: (shoutoutId) =>
    api.delete(`/admin/shoutouts/${shoutoutId}`),

  // ── Logs ──────────────────────────────────────────────────────────────────
  getLogs: (limit = 50) => api.get(`/admin/logs?limit=${limit}`),
};

export default adminAPI;
