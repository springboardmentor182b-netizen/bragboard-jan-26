import { useState, useEffect, useCallback } from "react";
import { adminService } from "../services/adminService";

const useAdminShoutouts = (type = "all") => {
  const [shoutouts, setShoutouts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMap = {
    all: adminService.getAllShoutouts,
    reported: adminService.getReportedShoutouts,
    harmful: adminService.getHarmfulShoutouts,
  };

  const fetchShoutouts = useCallback(async (skip = 0, limit = 20) => {
    setLoading(true);
    setError(null);
    try {
      const data = await (fetchMap[type] || adminService.getAllShoutouts)(skip, limit);
      setShoutouts(data.shoutouts);
      setTotal(data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [type]);

  const deleteShoutout = async (id) => {
    try {
      await adminService.deleteShoutout(id);
      setShoutouts((prev) => prev.filter((s) => s.id !== id));
      setTotal((prev) => prev - 1);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchShoutouts();
  }, [fetchShoutouts]);

  return { shoutouts, total, loading, error, refetch: fetchShoutouts, deleteShoutout };
};

export default useAdminShoutouts;
