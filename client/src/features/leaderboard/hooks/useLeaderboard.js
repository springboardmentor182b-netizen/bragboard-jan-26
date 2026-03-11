import { useState, useEffect, useCallback } from "react";
import {
  getTopSenders,
  getMostRecognised,
  getTopReactors,
} from "../services/leaderboardService";

const useLeaderboard = (initialPeriod = "monthly") => {
  const [period, setPeriod]                 = useState(initialPeriod);
  const [topSenders, setTopSenders]         = useState([]);
  const [mostRecognised, setMostRecognised] = useState([]);
  const [topReactors, setTopReactors]       = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState("");

  const fetchLeaderboard = useCallback(async (activePeriod) => {
    setLoading(true);
    setError("");
    try {
      const [sendersRes, recognisedRes, reactorsRes] = await Promise.all([
        getTopSenders(activePeriod),
        getMostRecognised(activePeriod),
        getTopReactors(activePeriod),
      ]);
      setTopSenders(sendersRes.data);
      setMostRecognised(recognisedRes.data);
      setTopReactors(reactorsRes.data);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to load leaderboard. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard(period);
  }, [period, fetchLeaderboard]);

  return {
    period,
    setPeriod,
    topSenders,
    mostRecognised,
    topReactors,
    loading,
    error,
  };
};

export default useLeaderboard;
