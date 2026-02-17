import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../data/constants';

/**
 * Fetches top employees leaderboard.
 * Calls: GET /api/users/leaderboard
 */
function useGetLeaderboard(limit = 10) {
  const [leaderboard, setLeaderboard] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    axios
      .get(`${API_BASE_URL}/users/leaderboard`, { params: { limit } })
      .then((res) => {
        if (!cancelled) {
          setLeaderboard(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.detail || 'Failed to load leaderboard');
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [limit]);

  return { leaderboard, loading, error };
}

export default useGetLeaderboard;
