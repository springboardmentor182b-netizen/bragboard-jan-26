import axios from 'axios';
import { API_BASE_URL } from '../../../data/constants';

/**
 * Direct API call: fetch shoutout feed with optional filters.
 */
async function getShoutoutFeed({ page = 1, pageSize = 10, department = '', senderId = null } = {}) {
  const params = { page, page_size: pageSize };
  if (department) params.department = department;
  if (senderId)   params.sender_id  = senderId;

  const response = await axios.get(`${API_BASE_URL}/users/feed`, { params });
  return response.data;
}

export default getShoutoutFeed;
