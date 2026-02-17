import axios from 'axios';
import { API_BASE_URL } from '../../../data/constants';

/**
 * Direct API call: fetch employee dashboard by userId.
 */
async function getUsersDashboard(userId) {
  const response = await axios.get(`${API_BASE_URL}/users/employee/${userId}`);
  return response.data;
}

export default getUsersDashboard;
