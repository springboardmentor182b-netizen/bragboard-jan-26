import React from "react";
import { Link } from "react-router-dom";
import "./AdminLayout.css";

function AdminLayout({ children }) {
  return (
    <div className="admin-layout">

      <div className="sidebar">
        <h2>Admin Panel</h2>
        <p className="brand">BragBoard</p>

        <Link to="/admin">Account Management</Link>
        <Link to="/admin/reports">Reported Shout-Outs</Link>
        <Link to="/admin/analysis">Platform Analysis</Link>
      </div>

      <div className="admin-content">
        {children}
      </div>

    </div>
  );
}

export default AdminLayout;