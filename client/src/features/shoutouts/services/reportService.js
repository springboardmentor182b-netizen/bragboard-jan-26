const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
const API_VERSION = process.env.REACT_APP_API_VERSION || "v1";

const API_BASE = `${BASE_URL}/api/${API_VERSION}`;

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("access_token")}`,
});

export const reportService = {
  async reportShoutout(shoutoutId, reason) {
    const res = await fetch(`${API_BASE}/reports/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ shoutout_id: shoutoutId, reason }),
    });
    if (!res.ok) throw new Error("Failed to report shoutout");
    return res.json();
  },

  async getAllReports(skip = 0, limit = 20) {
    const res = await fetch(`${API_BASE}/reports/?skip=${skip}&limit=${limit}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch reports");
    return res.json();
  },

  async resolveReport(reportId) {
    const res = await fetch(`${API_BASE}/reports/${reportId}/resolve`, {
      method: "PATCH",
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to resolve report");
    return res.json();
  },
};
