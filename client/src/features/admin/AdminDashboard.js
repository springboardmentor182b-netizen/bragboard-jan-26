import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";

const API = process.env.REACT_APP_API_URL;

function AdminDashboard() {

  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchReports();
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

  return (
    <div className="dashboard-container">
  
      <h2>Admin Dashboard</h2>
      <p className="subtitle">
        Welcome to BragBoard administration
      </p>
  
      <div className="dashboard-grid">
  
        {/* USERS CARD */}
        <div className="dashboard-card purple">
          <div className="card-top">
            <div>
              <h3>Account Management</h3>
              <p>Manage user accounts</p>
            </div>
            <div className="icon">👥</div>
          </div>
  
          <h1>{users.length}</h1>
          <span>Total Users</span>
        </div>
  
        {/* REPORTS CARD */}
        <div className="dashboard-card red">
          <div className="card-top">
            <div>
              <h3>Reported Shout-Outs</h3>
              <p>Review reported content</p>
            </div>
            <div className="icon">🚩</div>
          </div>
  
          <h1>{reports.length}</h1>
          <span>Pending Reports</span>
        </div>
  
      </div>
  
    </div>
  );
}

export default AdminDashboard;