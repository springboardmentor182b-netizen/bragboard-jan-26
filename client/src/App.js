import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar'; 
import AdminPanel from './pages/AdminPanel'; 
import ShoutoutManagement from './components/ShoutoutManagement';
import Leaderboard from './pages/Leaderboard'; // KEPT FROM GROUP

// Dashboard logic remains the same
const DashboardPlaceholder = () => {
  const API_URL = process.env.REACT_APP_API_BASE_URL;
  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: '#D35400' }}>🚀 BragBoard Admin</h1>
      <p style={{ color: '#666' }}>Welcome to the administration console. Select an option from the sidebar to begin.</p>
      <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
        <div style={cardStyle}>
          <h4>System Status</h4>
          <p style={{ color: '#27AE60', fontWeight: 'bold' }}>● Operational</p>
        </div>
        <div style={cardStyle}>
          <h4>Backend API</h4>
          <p>{API_URL || "Environment variable not found"}</p>
        </div>
      </div>
    </div>
  );
};

const cardStyle = {
  flex: 1,
  padding: '20px',
  background: '#fff',
  borderRadius: '10px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
  border: '1px solid #FFE0D0'
};

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar /> 
        <div style={{ flex: 1, backgroundColor: '#F9FAFB', padding: '20px' }}>
          <Routes>
            {/* DASHBOARD */}
            <Route path="/admin" element={<DashboardPlaceholder />} />

            {/* MANAGE SHOUTOUTS (Your Task) */}
            <Route path="/admin/shoutouts" element={<ShoutoutManagement />} /> 
            
            {/* REPORTED POSTS */}
            <Route path="/admin/reports" element={<AdminPanel />} />

            {/* LEADERBOARD (Kept from Group C) */}
            <Route path="/leaderboard" element={<Leaderboard />} />

            {/* REDIRECTS */}
            <Route path="/" element={<Navigate to="/admin" />} />
            <Route path="*" element={<h2>404: Not Found</h2>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;