import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import DashboardPage from './DashboardPage';
import CreateShoutoutPage from './CreateShoutoutPage';
import FeedPage from './FeedPage';
import MyShoutoutsPage from './MyShoutoutsPage';
import LeaderboardPage from './LeaderboardPage';
import ProfilePage from './ProfilePage';
import { dashboardService } from '../services/dashboardService';

const Dashboard = ({ onLogout, user }) => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const dashboardData = await dashboardService.getDashboard();
      setStats(dashboardData);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage stats={stats} />;
      case 'create':
        return <CreateShoutoutPage />;
      case 'feed':
        return <FeedPage />;
      case 'my-shoutouts':
        return <MyShoutoutsPage />;
      case 'leaderboard':
        return <LeaderboardPage />;
      case 'profile':
        return <ProfilePage user={user} />;
      default:
        return <DashboardPage stats={stats} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-primary">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-secondary">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        stats={{
          received: stats?.total_shoutouts_received || 0,
          given: stats?.total_shoutouts_sent || 0,
        }}
        onLogout={onLogout}
        user={user}
      />
      <div className="flex-1 ml-64 p-8">
        {renderPage()}
      </div>
    </div>
  );
};

export default Dashboard;
