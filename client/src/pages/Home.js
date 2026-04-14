import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ShoutoutFeed from '../features/shoutouts/components/ShoutoutFeed';
import ShoutoutForm from '../features/shoutouts/components/ShoutoutForm';
import Toast from '../components/Toast';

const Home = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');
  const userEmail = localStorage.getItem('email');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const mockUsers = [
    { id: 2, name: "Alice" },
    { id: 3, name: "Bob" },
    { id: 4, name: "Charlie" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleShoutoutSuccess = () => {
    setToastMessage('🎉 Shoutout posted successfully!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>BragBoard</h1>
        <div className="header-info">
          <span className="user-email">{userEmail}</span>
          <span className="user-role">{userRole === 'admin' ? '👑 Admin' : '⭐ Employee'}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
      
      {userRole === 'admin' && (
        <div className="admin-banner">
          🔐 Admin Mode - You have full moderation privileges
        </div>
      )}
      
      <div className="two-columns">
        <div>
          <ShoutoutForm 
            recipientOptions={mockUsers} 
            onSuccess={handleShoutoutSuccess}
          />
        </div>
        <div>
          <ShoutoutFeed />
        </div>
      </div>
      
      {showToast && (
        <Toast message={toastMessage} type="success" onClose={() => setShowToast(false)} />
      )}
    </div>
  );
};

export default Home;
