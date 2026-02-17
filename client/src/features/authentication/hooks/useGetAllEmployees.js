import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../data/constants';

/**
 * Fetches the full list of all employees.
 * Calls: GET /api/users/employees
 */
function useGetAllEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    axios
      .get(`${API_BASE_URL}/users/employees`)
      .then((res) => {
        if (!cancelled) {
          setEmployees(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.detail || 'Failed to load employees');
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, []);

  return { employees, loading, error };
}

export default useGetAllEmployees;
