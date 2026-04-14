import { useState, useEffect, useCallback } from "react";
import { adminService } from "../services/adminService";

const useAdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLogs = useCallback(async (skip = 0, limit = 50) => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getAdminLogs(skip, limit);
      setLogs(data.logs);
      setTotal(data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { logs, total, loading, error, refetch: fetchLogs };
};

export default useAdminLogs;
