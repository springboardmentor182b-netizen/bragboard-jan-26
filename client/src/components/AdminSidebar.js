import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Flag,
  BarChart3
} from "lucide-react";

const AdminSidebar = () => {
  const navItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Accounts", path: "/admin/accounts", icon: Users },
    { name: "Reports", path: "/admin/reports", icon: Flag },
    { name: "Analytics", path: "/admin/analytics", icon: BarChart3 },
  ];

  return (
    <div
      style={{
        width: "260px",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        background: "linear-gradient(180deg, #6a11cb, #ff4d8d)",
        color: "white",
        padding: "20px 15px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Logo / Title */}
      <h2 style={{ marginBottom: "30px", fontSize: "20px" }}>
        Admin Panel
      </h2>
      {/* Navigation */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/admin"} // important for dashboard exact match
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 12px",
                borderRadius: "8px",
                textDecoration: "none",
                color: "white",
                fontSize: "15px",
                background: isActive
                  ? "rgba(255, 255, 255, 0.2)"
                  : "transparent",
                fontWeight: isActive ? "600" : "400",
                transition: "0.2s",
              })}            >
              <Icon size={18} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSidebar;