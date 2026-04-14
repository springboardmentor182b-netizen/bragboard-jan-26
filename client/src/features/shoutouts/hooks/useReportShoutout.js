import { useState } from "react";
import { reportService } from "../services/reportService";

const useReportShoutout = (onSuccess) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const reportShoutout = async (shoutoutId, reason) => {
    setLoading(true);
    setError(null);
    try {
      const data = await reportService.reportShoutout(shoutoutId, reason);
      if (onSuccess) onSuccess(data);
      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { reportShoutout, loading, error };
};

export default useReportShoutout;
