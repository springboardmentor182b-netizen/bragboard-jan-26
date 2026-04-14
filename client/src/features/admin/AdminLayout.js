import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Shield, Users, Flag, BarChart2 } from "lucide-react";
import "./AdminLayout.css";

function AdminLayout() {
  return (
    <div className="admin-layout">

      <div className="sidebar">

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <Shield className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold m-0 p-0 leading-tight">Admin Panel</h2>
            <p className="brand m-0 p-0 text-sm opacity-80 leading-tight">BragBoard</p>
          </div>
        </div>

        <div className="nav-links">

          <NavLink to="/admin/accounts"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <Users size={18} /> <span>Account Management</span>
          </NavLink>

          <NavLink to="/admin/reports"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <Flag size={18} /> <span>Reported Shout-Outs</span>
          </NavLink>

          <NavLink to="/admin/analytics"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <BarChart2 size={18} /> <span>Platform Analysis</span>
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