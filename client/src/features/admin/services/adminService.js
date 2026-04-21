const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
const API_VERSION = process.env.REACT_APP_API_VERSION || "v1";

const API_BASE = `${BASE_URL}/api/${API_VERSION}`;

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("access_token")}`,
});

export const adminService = {
  async getAllShoutouts(skip = 0, limit = 20) {
    const res = await fetch(`${API_BASE}/admin/shoutouts?skip=${skip}&limit=${limit}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch all shoutouts");
    return res.json();
  },

  async getReportedShoutouts(skip = 0, limit = 20) {
    const res = await fetch(`${API_BASE}/admin/shoutouts/reported?skip=${skip}&limit=${limit}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch reported shoutouts");
    return res.json();
  },

  async getHarmfulShoutouts(skip = 0, limit = 20) {
    const res = await fetch(`${API_BASE}/admin/shoutouts/harmful?skip=${skip}&limit=${limit}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch harmful shoutouts");
    return res.json();
  },

  async deleteShoutout(shoutoutId) {
    const res = await fetch(`${API_BASE}/admin/shoutouts/${shoutoutId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete shoutout");
    return res.json();
  },

  async getAdminLogs(skip = 0, limit = 50) {
    const res = await fetch(`${API_BASE}/admin/logs?skip=${skip}&limit=${limit}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch admin logs");
    return res.json();
  },
};
