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
  getReports: () => api.get('/reports/'),
  deleteReport: (reportId) => api.delete(`/reports/${reportId}`),

  // ── Moderation Thread ─────────────────────────────────────────────────────
  addModerationNote: (shoutoutId, message) =>
    api.post('/moderation/notes', { shoutout_id: shoutoutId, message }),
  getModerationNotes: (shoutoutId) =>
    api.get(`/moderation/notes/${shoutoutId}`),
  acceptShoutout: (shoutoutId) =>
    api.post(`/moderation/accept/${shoutoutId}`),
  rejectShoutout: (shoutoutId, reason) =>
    api.post(`/moderation/reject/${shoutoutId}`, { reason }),

  // ── Logs ──────────────────────────────────────────────────────────────────
  getLogs: (limit = 50) => api.get(`/admin/logs?limit=${limit}`),
};

export default adminAPI;
