import { getApiUrl } from "../config/api";

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("access_token")}`,
});

export const httpClient = {
  async get(endpoint, options = {}) {
    const res = await fetch(getApiUrl(endpoint), {
      method: "GET",
      headers: getAuthHeaders(),
      ...options,
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
  },

  async post(endpoint, data, options = {}) {
    const res = await fetch(getApiUrl(endpoint), {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
      ...options,
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
  },

  async put(endpoint, data, options = {}) {
    const res = await fetch(getApiUrl(endpoint), {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
      ...options,
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
  },

  async patch(endpoint, data, options = {}) {
    const res = await fetch(getApiUrl(endpoint), {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
      ...options,
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
  },

  async delete(endpoint, options = {}) {
    const res = await fetch(getApiUrl(endpoint), {
      method: "DELETE",
      headers: getAuthHeaders(),
      ...options,
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
  },
};
