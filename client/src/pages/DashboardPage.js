import React from 'react';
import { Heart, Send, TrendingUp, Users } from 'lucide-react';

const DashboardPage = ({ stats }) => {
  const statCards = [
    {
      label: 'Shoutouts Received',
      value: stats?.total_shoutouts_received || 0,
      icon: Heart,
      color: 'bg-accent1',
    },
    {
      label: 'Shoutouts Given',
      value: stats?.total_shoutouts_sent || 0,
      icon: Send,
      color: 'bg-primary',
    },
    {
      label: 'Total Engagement',
      value: (stats?.total_shoutouts_received || 0) + (stats?.total_shoutouts_sent || 0),
      icon: TrendingUp,
      color: 'bg-accent1',
    },
    {
      label: 'Team Members',
      value: 24,
      icon: Users,
      color: 'bg-primary',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Dashboard</h1>
        <p className="text-accent1">Welcome back! Here's your recognition summary.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-lg p-6 shadow-md border-2 border-accent2">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6 text-secondary" />
                </div>
              </div>
              <p className="text-accent1 text-sm mb-1">{stat.label}</p>
              <p className="text-4xl font-bold text-primary">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg p-6 shadow-md border-2 border-accent2">
        <h2 className="text-xl font-bold text-primary mb-4">Recent Activity</h2>
        <div className="text-center py-12">
          <p className="text-accent1">No recent shoutouts yet. Start recognizing your colleagues!</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
