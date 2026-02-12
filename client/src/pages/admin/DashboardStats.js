import React from 'react';

const DashboardStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Shout-Outs',
      value: stats?.totalShoutouts || 0,
      icon: '🎉',
      color: 'blue',
      trend: stats?.shoutoutsTrend || 0
    },
    {
      title: 'Active Users',
      value: stats?.activeUsers || 0,
      icon: '👥',
      color: 'green',
      trend: stats?.usersTrend || 0
    },
    {
      title: 'Total Reactions',
      value: stats?.totalReactions || 0,
      icon: '❤️',
      color: 'red',
      trend: stats?.reactionsTrend || 0
    },
    {
      title: 'Total Comments',
      value: stats?.totalComments || 0,
      icon: '💬',
      color: 'purple',
      trend: stats?.commentsTrend || 0
    },
    {
      title: 'Flagged Content',
      value: stats?.flaggedContent || 0,
      icon: '⚠️',
      color: 'yellow',
      alert: stats?.flaggedContent > 0
    },
    {
      title: 'Departments',
      value: stats?.totalDepartments || 0,
      icon: '🏢',
      color: 'indigo'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      red: 'bg-red-50 text-red-600',
      purple: 'bg-purple-50 text-purple-600',
      yellow: 'bg-yellow-50 text-yellow-600',
      indigo: 'bg-indigo-50 text-indigo-600'
    };
    return colors[color] || colors.blue;
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return '↑';
    if (trend < 0) return '↓';
    return '→';
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Overview Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div 
            key={index}
            className={`
              bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow
              ${stat.alert ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'}
            `}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <div className="mt-2 flex items-baseline">
                  <p className="text-3xl font-semibold text-gray-900">
                    {stat.value.toLocaleString()}
                  </p>
                  {stat.trend !== undefined && (
                    <span className={`ml-2 text-sm font-medium ${getTrendColor(stat.trend)}`}>
                      {getTrendIcon(stat.trend)} {Math.abs(stat.trend)}%
                    </span>
                  )}
                </div>
                {stat.trend !== undefined && (
                  <p className="mt-1 text-xs text-gray-500">vs last week</p>
                )}
              </div>
              <div className={`
                flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-2xl
                ${getColorClasses(stat.color)}
              `}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardStats;