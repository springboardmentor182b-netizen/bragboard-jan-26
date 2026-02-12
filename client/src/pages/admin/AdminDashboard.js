import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardStats from './DashboardStats';
import TopContributors from './TopContributors';
import MostTagged from './MostTagged';
import RecentActivity from './RecentActivity';
import FlaggedContent from './FlaggedContent';
import EngagementChart from './EngagementChart';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is admin
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      navigate('/');
      return;
    }

    fetchDashboardStats();
  }, [navigate]);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:8000/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }

      const data = await response.json();
      setStats(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'moderation', label: 'Moderation', icon: '🛡️' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'users', label: 'Users', icon: '👥' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 text-xl font-semibold mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchDashboardStats}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/feed')}
                className="text-gray-600 hover:text-gray-900"
              >
                Back to Feed
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab.id 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <DashboardStats stats={stats} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TopContributors />
              <MostTagged />
            </div>

            <EngagementChart />
            
            <RecentActivity />
          </div>
        )}

        {activeTab === 'moderation' && (
          <FlaggedContent />
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <EngagementChart />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TopContributors />
              <MostTagged />
            </div>
          </div>
        )}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">User Management</h2>
            <p className="text-gray-500">User management features coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;