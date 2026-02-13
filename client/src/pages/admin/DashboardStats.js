import React from 'react';
import { Award, Users, TrendingUp, ArrowUp } from 'lucide-react';

const DashboardStats = ({ data }) => {
  const stats = [
    {
      title: 'Total Shout-Outs',
      value: data.totalShoutouts || 247,
      trend: `+${data.trends?.shoutouts || 12}% from last month`,
      icon: Award,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Active Users',
      value: data.activeUsers || 156,
      trend: `+${data.trends?.users || 8}% from last month`,
      icon: Users,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Engagement Rate',
      value: `${data.engagementRate || 89}%`,
      trend: `+${data.trends?.engagement || 5}% from last month`,
      icon: TrendingUp,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">{stat.trend}</span>
                </div>
              </div>
              <div className={`${stat.iconBg} p-3 rounded-full`}>
                <Icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
