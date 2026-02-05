import apiClient from '../config/axios';
import { API_ENDPOINTS } from '../config/api';

export const profileService = {
  getProfile: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PROFILE);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to fetch profile' };
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.put(API_ENDPOINTS.PROFILE, profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to update profile' };
    }
  },
};
