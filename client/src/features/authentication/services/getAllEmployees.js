import axios from 'axios';
import { API_BASE_URL } from '../../../data/constants';

/**
 * Direct API call: fetch all employees.
 */
async function getAllEmployees() {
  const response = await axios.get(`${API_BASE_URL}/users/employees`);
  return response.data;
}

export default getAllEmployees;
