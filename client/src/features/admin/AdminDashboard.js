import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import "./AdminDashboard.css";
const API = "http://127.0.0.1:8000";

function AdminDashboard() {

  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);

  const [overview, setOverview] = useState({
    shoutouts: 0,
    reactions: 0,
    activeUsers: 0,
    growth: 0
  });

  useEffect(() => {
    fetchUsers();
    fetchReports();
    fetchOverview();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API}/admin/users`);
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.log("Users fetch error", error);
    }
  };

  const fetchReports = async () => {
    try {
      const res = await fetch(`${API}/admin/reports`);
      const data = await res.json();
      setReports(data);
    } catch (error) {
      console.log("Reports fetch error", error);
    }
  };

  const fetchOverview = async () => {
    try {
      const res = await fetch(`${API}/admin/analytics`);
      const data = await res.json();
      setOverview(data);
    } catch (error) {
      console.log("Analytics fetch error", error);
    }
  };
  return (
    <AdminLayout>
      <div className="admin-dashboard">
  
        <h2>Admin Dashboard</h2>
        <p>Welcome to BragBoard administration</p>
  
        {/* Cards */}
        <div className="dashboard-cards">
  
          <div className="card">
            <h3>Account Management</h3>
            <p>Manage user accounts</p>
            <h1>{users.length}</h1>
            <span>Total Users</span>
          </div>
  
          <div className="card">
            <h3>Reported Shout-Outs</h3>
            <p>Review reported content</p>
            <h1>{reports.length}</h1>
            <span>Pending Reports</span>
          </div>
  
        </div>
  
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;