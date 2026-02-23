import React, { useEffect, useState } from 'react';
import DashboardStats from './admin/DashboardStats';
import TopContributors from './admin/TopContributors';
import EngagementChart from './admin/EngagementChart';
import RecentActivity from './admin/RecentActivity';
import FlaggedContent from './admin/FlaggedContent';


import { Search } from 'lucide-react';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalShoutouts: 247,
    activeUsers: 156,
    engagementRate: 89,
    trends: {
      shoutouts: 12,
      users: 8,
      engagement: 5
    }
  });

  // In real app, fetch from API
  useEffect(() => {
    // fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Admin Tools</h1>
          <p className="text-gray-600 mt-1">Monitor platform performance</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white font-semibold">
            AD
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <DashboardStats data={dashboardData} />

      {/* Top Contributors Section */}
      <TopContributors />

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EngagementChart />
        <RecentActivity />
      </div>

      {/* Flagged Content */}
      <FlaggedContent />
    </div>
  );
};

export default Dashboard;
