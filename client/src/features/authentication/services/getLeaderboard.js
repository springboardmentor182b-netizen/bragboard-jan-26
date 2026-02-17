import axios from 'axios';
import { API_BASE_URL } from '../../../data/constants';

/**
 * Direct API call: fetch leaderboard.
 */
async function getLeaderboard(limit = 10) {
  const response = await axios.get(`${API_BASE_URL}/users/leaderboard`, {
    params: { limit },
  });
  return response.data;
}

export default getLeaderboard;
