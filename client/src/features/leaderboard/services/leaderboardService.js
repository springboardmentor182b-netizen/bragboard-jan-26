import api from "../../authentication/services/api";
// ↑ This is the shared axios instance already in your project (same as reports.js uses)

// GET /api/leaderboard/top-senders?period=monthly
export const getTopSenders = (period = "monthly") =>
  api.get("/api/leaderboard/top-senders", { params: { period } });

// GET /api/leaderboard/most-recognised?period=monthly
export const getMostRecognised = (period = "monthly") =>
  api.get("/api/leaderboard/most-recognised", { params: { period } });

// GET /api/leaderboard/top-reactors?period=monthly
export const getTopReactors = (period = "monthly") =>
  api.get("/api/leaderboard/top-reactors", { params: { period } });
