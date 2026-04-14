import { useState, useEffect, useCallback } from "react";
import { shoutoutService } from "../services/shoutoutService";

const useShoutouts = (initialFilters = {}) => {
  const [shoutouts, setShoutouts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchShoutouts = useCallback(async (skip = 0, limit = 20, filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await shoutoutService.getAllShoutouts(skip, limit, filters);
      setShoutouts(data.shoutouts);
      setTotal(data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShoutouts(0, 20, initialFilters);
  }, [fetchShoutouts, initialFilters]);

  return { shoutouts, total, loading, error, refetch: fetchShoutouts };
};

export default useShoutouts;
