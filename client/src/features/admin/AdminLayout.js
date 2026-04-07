import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./AdminLayout.css";

function AdminLayout() {
  return (
    <div className="admin-layout">

      <div className="sidebar">

        <h2>Admin Panel</h2>
        <p className="brand">BragBoard</p>

        <div className="nav-links">

          <NavLink to="/admin" end
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            📊 <span>Dashboard</span>
          </NavLink>

          <NavLink to="/admin/accounts"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            👤 <span>Account Management</span>
          </NavLink>

          <NavLink to="/admin/reports"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            🚩 <span>Reported Shout-Outs</span>
          </NavLink>

          <NavLink to="/admin/analytics"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            📊 <span>Platform Analysis</span>
          </NavLink>

        </div>

      </div>

      <div className="admin-content">
        <Outlet />
      </div>

    </div>
  );
}

export default AdminLayout;