import apiClient from '../config/axios';
import { API_ENDPOINTS } from '../config/api';

export const shoutoutService = {
  getFeed: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.SHOUTOUTS_FEED);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to fetch feed' };
    }
  },

  getMyShoutouts: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.MY_SHOUTOUTS);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to fetch shoutouts' };
    }
  },

  createShoutout: async (shoutoutData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.SHOUTOUTS, shoutoutData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to create shoutout' };
    }
  },

  getShoutoutById: async (id) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.SHOUTOUTS}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to fetch shoutout' };
    }
  },
};
