export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  SHOUTOUTS: `${API_BASE_URL}/shoutouts`,
  SHOUTOUTS_FEED: `${API_BASE_URL}/shoutouts/feed`,
  MY_SHOUTOUTS: `${API_BASE_URL}/shoutouts/my`,
  DASHBOARD: `${API_BASE_URL}/users/dashboard`,
  CATEGORIES: `${API_BASE_URL}/categories`,
  REACTIONS: `${API_BASE_URL}/reactions`,
  LEADERBOARD: `${API_BASE_URL}/leaderboard`,
  PROFILE: `${API_BASE_URL}/users/profile`,
};

export default API_BASE_URL;
