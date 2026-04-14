const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
const API_VERSION = process.env.REACT_APP_API_VERSION || "v1";

const API_BASE = `${BASE_URL}/api/${API_VERSION}`;

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("access_token")}`,
});

export const shoutoutService = {
  async createShoutout(message, recipientIds, department = null, attachment = null) {
    const body = { 
      message, 
      recipient_ids: recipientIds,
      department: department || null
    };
    
    // For now, we'll skip attachment to avoid complexity
    // You can implement file upload later
    
    const res = await fetch(`${API_BASE}/shoutouts/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || "Failed to create shoutout");
    }
    return res.json();
  },

  async getAllShoutouts(skip = 0, limit = 20, filters = {}) {
    let url = `${API_BASE}/shoutouts/?skip=${skip}&limit=${limit}`;
    
    if (filters.department) url += `&department=${encodeURIComponent(filters.department)}`;
    if (filters.sender_id) url += `&sender_id=${filters.sender_id}`;
    if (filters.recipient_id) url += `&recipient_id=${filters.recipient_id}`;
    if (filters.start_date) url += `&start_date=${filters.start_date.toISOString()}`;
    if (filters.end_date) url += `&end_date=${filters.end_date.toISOString()}`;
    
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Failed to fetch shoutouts");
    return res.json();
  },

  async getShoutoutById(id) {
    const res = await fetch(`${API_BASE}/shoutouts/${id}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Failed to fetch shoutout");
    return res.json();
  },

  async deleteShoutout(id) {
    const res = await fetch(`${API_BASE}/shoutouts/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete shoutout");
    return res.json();
  },
  
  async getDepartments() {
    const res = await fetch(`${API_BASE}/shoutouts/departments`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Failed to fetch departments");
    return res.json();
  }
};
