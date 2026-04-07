import React, { useEffect, useState } from "react";
import "./AdminAnalytics.css";
const API = process.env.REACT_APP_API_URL;

function AdminAnalytics() {

  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`${API}/admin/analytics`)
      .then(res => res.json())
      .then(data => {
        console.log("DATA:", data);
        setStats(data);
      })
      .catch(err => console.error(err));
  }, []);

  if (!stats) return <h2>Loading...</h2>;

  return (
    <div className="analytics-container">
      <h2 className="analytics-title">📊 Platform Analysis</h2>
  
      <div className="analytics-cards">
  
        <div className="analytics-card users">
          <h3>Total Users</h3>
          <p>{stats.total_users}</p>
        </div>
  
        <div className="analytics-card reports">
          <h3>Total Reports</h3>
          <p>{stats.total_reports}</p>
        </div>
  
        <div className="analytics-card shoutouts">
          <h3>Total Shoutouts</h3>
          <p>{stats.total_shoutouts}</p>
        </div>
  
      </div>
    </div>
  );
}



export default AdminAnalytics;