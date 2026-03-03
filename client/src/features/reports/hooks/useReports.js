import { useState, useEffect, useCallback } from "react";
import {
  getAdminReports,
  resolveReport,
  deleteReportedShoutout,
} from "../services/reports";

const useReports = (initialFilter = "pending") => {
  const [reports, setReports]             = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [activeFilter, setActiveFilter]   = useState(initialFilter);

  const fetchReports = useCallback(async (filter) => {
    setLoading(true);
    setError("");
    try {
      const res = await getAdminReports(filter === "All" ? "" : filter);
      setReports(res.data);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to load reports. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports(activeFilter);
  }, [activeFilter, fetchReports]);

  const handleResolve = async (reportId, action) => {
    setActionLoading(`${reportId}-${action}`);
    setError("");
    try {
      await resolveReport(reportId, action);
      await fetchReports(activeFilter);
    } catch (err) {
      setError(err.response?.data?.detail || "Action failed. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (reportId) => {
    if (!window.confirm("Delete this shoutout permanently? This cannot be undone."))
      return;
    setActionLoading(`${reportId}-delete`);
    setError("");
    try {
      await deleteReportedShoutout(reportId);
      await fetchReports(activeFilter);
    } catch (err) {
      setError(err.response?.data?.detail || "Delete failed. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const pendingCount = reports.filter((r) => r.status === "pending").length;

  return {
    reports,
    loading,
    error,
    actionLoading,
    activeFilter,
    setActiveFilter,
    pendingCount,
    handleResolve,
    handleDelete,
  };
};

export default useReports;