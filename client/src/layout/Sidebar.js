import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');

  const handleLogout = () => {
    logout();
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={{ width: '250px', background: '#213555', color: 'white', padding: '20px', minHeight: '100vh' }}>
      <h2 style={{ marginBottom: '30px' }}>BragBoard</h2>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '15px' }}><Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link></li>
          <li style={{ marginBottom: '15px' }}><Link to="/shoutout-feed" style={{ color: 'white', textDecoration: 'none' }}>Shoutout Feed</Link></li>
          <li style={{ marginBottom: '15px' }}><Link to="/create-shoutout" style={{ color: 'white', textDecoration: 'none' }}>Create Shoutout</Link></li>
          <li style={{ marginBottom: '15px' }}><Link to="/leaderboard" style={{ color: 'white', textDecoration: 'none' }}>Leaderboard</Link></li>
          <li style={{ marginBottom: '15px' }}><Link to="/profile" style={{ color: 'white', textDecoration: 'none' }}>My Profile</Link></li>
          {userRole === 'admin' && (
            <li style={{ marginBottom: '15px' }}><Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>Admin Panel</Link></li>
          )}
          <li style={{ marginTop: '30px' }}>
            <button onClick={handleLogout} style={{ background: '#e53e3e', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', width: '100%' }}>Logout</button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
