import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL, DEFAULT_PAGE_SIZE } from '../../../data/constants';

/**
 * Fetches paginated shoutout feed with optional filters.
 * Calls: GET /api/users/feed
 */
function useGetShoutoutFeed({ page = 1, pageSize = DEFAULT_PAGE_SIZE, department = '', senderId = null } = {}) {
  const [feed, setFeed]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    const params = { page, page_size: pageSize };
    if (department) params.department = department;
    if (senderId)   params.sender_id  = senderId;

    axios
      .get(`${API_BASE_URL}/users/feed`, { params })
      .then((res) => {
        if (!cancelled) {
          setFeed(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.detail || 'Failed to load feed');
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [page, pageSize, department, senderId]);

  return { feed, loading, error };
}

export default useGetShoutoutFeed;
