import axios from "axios";

// 🔥 Base API URL (change if needed)
const API_BASE =process.env.REACT_APP_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==============================
// 👤 USERS
// ==============================

// Get all users
export const getAllUsers = async () => {
  try {
    const res = await api.get("/admin/users");
    return res.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

// Delete user
export const deleteUser = async (userId) => {
  try {
    const res = await api.delete(`/admin/users/${userId}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// ==============================
// 🚩 REPORTS
// ==============================

// Get all reports
export const getReports = async () => {
  try {
    const res = await api.get("/admin/reports");
    return res.data;
  } catch (error) {
    console.error("Error fetching reports:", error);
    return [];
  }
};

// Mark report as reviewed
export const markReportReviewed = async (reportId) => {
  try {
    const res = await api.put(`/admin/reports/${reportId}/review`);
    return res.data;
  } catch (error) {
    console.error("Error updating report:", error);
    throw error;
  }
};

// Delete reported shout-out
export const deleteReportedShout = async (shoutId) => {
  try {
    const res = await api.delete(`/admin/shouts/${shoutId}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting shout:", error);
    throw error;
  }
};

// ==============================
// 📊 ANALYTICS
// ==============================

// Get total users count
export const getTotalUsers = async () => {
  try {
    const res = await api.get("/admin/users");
    return res.data.length;
  } catch (error) {
    console.error("Error fetching user count:", error);
    return 0;
  }
};

// Get total reports count
export const getTotalReports = async () => {
  try {
    const res = await api.get("/admin/reports");
    return res.data.length;
  } catch (error) {
    console.error("Error fetching report count:", error);
    return 0;
  }
};