const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000",
  version: process.env.REACT_APP_API_VERSION || "v1",
  timeout: 30000,
};

export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.baseURL}/api/${API_CONFIG.version}${endpoint}`;
};

export default API_CONFIG;
