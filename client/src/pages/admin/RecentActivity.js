import React, { useState, useEffect } from 'react';

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:8000/api/admin/recent-activity', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities || []);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    const icons = {
      'shoutout': '🎉',
      'reaction': '❤️',
      'comment': '💬',
      'report': '⚠️',
      'delete': '🗑️',
      'resolve': '✅'
    };
    return icons[type] || '📌';
  };

  const getActivityColor = (type) => {
    const colors = {
      'shoutout': 'bg-blue-50 text-blue-600',
      'reaction': 'bg-red-50 text-red-600',
      'comment': 'bg-purple-50 text-purple-600',
      'report': 'bg-yellow-50 text-yellow-600',
      'delete': 'bg-red-50 text-red-600',
      'resolve': 'bg-green-50 text-green-600'
    };
    return colors[type] || 'bg-gray-50 text-gray-600';
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return past.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <p className="text-sm text-gray-500 mt-1">Latest actions across the platform</p>
        </div>
        <button 
          onClick={fetchRecentActivity}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No recent activity</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div 
              key={index}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className={`
                flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-xl
                ${getActivityColor(activity.type)}
              `}>
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{activity.user?.name || 'Someone'}</span>
                  {' '}
                  <span className="text-gray-600">{activity.action}</span>
                  {activity.target && (
                    <>
                      {' '}
                      <span className="text-gray-600">for</span>
                      {' '}
                      <span className="font-medium">{activity.target}</span>
                    </>
                  )}
                </p>
                <div className="flex items-center mt-1 space-x-3">
                  <p className="text-xs text-gray-500">
                    {formatTimeAgo(activity.timestamp)}
                  </p>
                  {activity.department && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs text-gray-500">{activity.department}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200 text-center">
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          View All Activity
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;