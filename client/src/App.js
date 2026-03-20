import React, { useState, useEffect } from 'react';
import Sidebar from './layout/Sidebar';
import Dashboard from './pages/Dashboard';
import CreateShoutout from './pages/CreateShoutout';
import ShoutoutFeed from './pages/ShoutoutFeed';
import MyShoutouts from './pages/MyShoutouts';
import Leaderboard from './pages/Leaderboard';
import MyProfile from './pages/MyProfile';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// TODO: Replace with actual authentication
// For now, using ID 1 as temporary current user
const CURRENT_USER_ID = 1;

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(`${API_BASE}/users/${CURRENT_USER_ID}`);
      const data = await response.json();
      setCurrentUser(data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setCurrentUser({
        id: CURRENT_USER_ID,
        name: 'John Smith',
        email: 'john.smith@company.com',
        department: 'Product',
        job_title: 'Product Manager'
      });
    }
  };

  const renderPage = () => {
    const currentUserId = currentUser?.id || CURRENT_USER_ID;
    
    switch(currentPage) {
      case 'dashboard':
        return <Dashboard currentUserId={currentUserId} />;
      case 'create':
        return <CreateShoutout currentUserId={currentUserId} />;
      case 'feed':
        return <ShoutoutFeed />;
      case 'myshoutouts':
        return <MyShoutouts currentUserId={currentUserId} />;
      case 'leaderboard':
        return <Leaderboard currentUserId={currentUserId} />;
      case 'profile':
        return <MyProfile currentUserId={currentUserId} />;
      default:
        return <Dashboard currentUserId={currentUserId} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5EFE7]">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        currentUser={currentUser}
      />
      <div className="ml-64">
        {renderPage()}
      </div>
    </div>
  );
}

export default App;
