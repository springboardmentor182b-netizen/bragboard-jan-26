import api from "../../authentication/services/api";
// ↑ using your existing api.js from authentication/services/

// EMPLOYEE: Report a shoutout
// POST /api/reports/
export const reportShoutout = (shoutoutId, reason) =>
  api.post("/api/reports/", {
    shoutout_id: shoutoutId,
    reason,
  });

// ADMIN: Get all reported shoutouts
// statusFilter: "pending" | "resolved" | "dismissed" | "" (all)
// GET /api/reports/admin
export const getAdminReports = (statusFilter = "") =>
  api.get("/api/reports/admin", {
    params: statusFilter ? { status_filter: statusFilter } : {},
  });

// ADMIN: Resolve or dismiss a report
// action: "resolved" | "dismissed"
// PATCH /api/reports/admin/:reportId/resolve
export const resolveReport = (reportId, action) =>
  api.patch(`/api/reports/admin/${reportId}/resolve`, { action });

// ADMIN: Delete shoutout tied to a report
// DELETE /api/reports/admin/:reportId/delete-shoutout
export const deleteReportedShoutout = (reportId) =>
  api.delete(`/api/reports/admin/${reportId}/delete-shoutout`);