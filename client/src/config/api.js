const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGIN: `${API_BASE_URL}/auth/token`,
  ME: `${API_BASE_URL}/auth/me`,
  DASHBOARD: `${API_BASE_URL}/users/dashboard`,
};

export default API_BASE_URL;
