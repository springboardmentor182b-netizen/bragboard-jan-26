import apiClient from '../config/axios';
import { API_ENDPOINTS } from '../config/api';

export const leaderboardService = {
  getLeaderboard: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.LEADERBOARD);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to fetch leaderboard' };
    }
  },
};
