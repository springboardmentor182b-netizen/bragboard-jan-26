import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "./features/admin/AdminLayout";
import AdminDashboard from "./features/admin/AdminDashboard";
import AdminReports from "./features/admin/AdminReports";
import AccountManagement from "./features/admin/AccountManagement";
import AdminAnalytics from "./features/admin/AdminAnalytics";
function App() {
  return (
    <Routes>

      {/* Redirect root → /admin */}
      <Route path="/" element={<Navigate to="/admin" />} />

      {/* 🔥 Admin Layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="accounts" element={<AccountManagement />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="analytics" element={<AdminAnalytics />} /> 
      </Route>

    </Routes>
  );
}


export default App;
