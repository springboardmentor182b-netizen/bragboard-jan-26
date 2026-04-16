import React, { useState, useEffect } from 'react';
import ShoutoutFeed from '../features/shoutouts/components/ShoutoutFeed';
import ShoutoutForm from '../features/shoutouts/components/ShoutoutForm';

const Home = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/users/');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleShoutoutSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  if (loading) {
    return <div className="container">Loading users...</div>;
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🎉 BragBoard</h1>
        <div className="header-info">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
      
      <div className="two-columns">
        <div>
          <ShoutoutForm 
            recipientOptions={users} 
            onSuccess={handleShoutoutSuccess}
          />
        </div>
        <div>
          <ShoutoutFeed key={refreshKey} />
        </div>
      </div>
    </div>
  );
};

export default Home;
