import { useState, useEffect, useCallback } from "react";
import { reportService } from "../../shoutouts/services/reportService";

const useReports = () => {
  const [reports, setReports] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async (skip = 0, limit = 20) => {
    setLoading(true);
    setError(null);
    try {
      const data = await reportService.getAllReports(skip, limit);
      setReports(data.reports);
      setTotal(data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const resolveReport = async (id) => {
    try {
      await reportService.resolveReport(id);
      setReports((prev) => prev.map((r) => 
        r.id === id ? { ...r, resolved: true } : r
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return { reports, total, loading, error, refetch: fetchReports, resolveReport };
};

export default useReports;
