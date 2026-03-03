import React from "react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-blue-900 text-white flex flex-col justify-between">
      
      {/* Top Section */}
      <div>
        <div className="p-6 text-2xl font-bold border-b border-blue-700">
          BragBoard
        </div>

        <nav className="p-4 space-y-2">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              isActive
                ? "flex items-center gap-2 bg-blue-700 px-4 py-2 rounded"
                : "flex items-center gap-2 px-4 py-2 hover:bg-blue-800 rounded cursor-pointer"
            }
          >
            📊 Dashboard
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              isActive
                ? "flex items-center gap-2 bg-blue-700 px-4 py-2 rounded"
                : "flex items-center gap-2 px-4 py-2 hover:bg-blue-800 rounded cursor-pointer"
            }
          >
            👥 User Management
          </NavLink>

          <NavLink
            to="/admin/shoutouts"
            className={({ isActive }) =>
              isActive
                ? "flex items-center gap-2 bg-blue-700 px-4 py-2 rounded"
                : "flex items-center gap-2 px-4 py-2 hover:bg-blue-800 rounded cursor-pointer"
            }
          >
            💬 Shout-outs Management
          </NavLink>

          {/* ← NEW: Reported Shoutouts */}
          <NavLink
            to="/admin/reported-shoutouts"
            className={({ isActive }) =>
              isActive
                ? "flex items-center justify-between bg-blue-700 px-4 py-2 rounded"
                : "flex items-center justify-between px-4 py-2 hover:bg-blue-800 rounded cursor-pointer"
            }
          >
            <span>🚩 Reported Shoutouts</span>
          </NavLink>

          <NavLink
            to="/admin/reports"
            className={({ isActive }) =>
              isActive
                ? "flex items-center gap-2 bg-blue-700 px-4 py-2 rounded"
                : "flex items-center gap-2 px-4 py-2 hover:bg-blue-800 rounded cursor-pointer"
            }
          >
            📄 Reports
          </NavLink>
        </nav>

        {/* Quick Stats */}
        <div className="px-4 mt-6">
          <h2 className="font-semibold mb-2">Quick Stats</h2>
          <div className="text-sm space-y-1 text-gray-200">
            <div>Active Users: 120</div>
            <div>Administrators: 5</div>
            <div>Managers: 12</div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-blue-700">
        <div className="text-sm mb-3">admin@company.com</div>
        <button className="w-full bg-red-500 hover:bg-red-600 py-2 rounded">
          Logout
        </button>
      </div>

    </div>
  );
}

export default Sidebar;