import apiClient from '../config/axios';
import { API_ENDPOINTS } from '../config/api';

export const reactionService = {
  addReaction: async (shoutoutId, reactionType) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.REACTIONS, {
        shoutout_id: shoutoutId,
        type: reactionType,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to add reaction' };
    }
  },

  removeReaction: async (reactionId) => {
    try {
      const response = await apiClient.delete(`${API_ENDPOINTS.REACTIONS}/${reactionId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to remove reaction' };
    }
  },
};
