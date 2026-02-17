import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../data/constants';

/**
 * Fetches the full employee dashboard for a given userId.
 * Calls: GET /api/users/employee/{userId}
 */
function useGetEmployeeDashboard(userId) {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    setLoading(true);
    setError(null);

    axios
      .get(`${API_BASE_URL}/users/employee/${userId}`)
      .then((res) => {
        if (!cancelled) {
          setDashboard(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.detail || 'Failed to load dashboard');
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [userId]);

  return { dashboard, loading, error };
}

export default useGetEmployeeDashboard;
