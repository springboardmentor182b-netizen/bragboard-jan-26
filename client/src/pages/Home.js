import React, { useState } from 'react';
import ShoutoutFeed from '../features/shoutouts/components/ShoutoutFeed';
import ShoutoutForm from '../features/shoutouts/components/ShoutoutForm';

const Home = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleShoutoutSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleLogout = () => {
    // Clear any stored data
    localStorage.clear();
    sessionStorage.clear();
    // Reload the page to reset state
    window.location.reload();
  };

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
