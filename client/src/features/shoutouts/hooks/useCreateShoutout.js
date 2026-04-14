import { useState } from "react";
import { shoutoutService } from "../services/shoutoutService";

const useCreateShoutout = (onSuccess) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createShoutout = async (message, recipientIds, department, attachment) => {
    setLoading(true);
    setError(null);
    try {
      const data = await shoutoutService.createShoutout(message, recipientIds, department, attachment);
      if (onSuccess) onSuccess(data);
      return data;
    } catch (err) {
      setError(err.message || "Failed to create shoutout");
      console.error("Create shoutout error:", err);
    } finally {
      setLoading(false);
    }
  };

  return { createShoutout, loading, error };
};

export default useCreateShoutout;
