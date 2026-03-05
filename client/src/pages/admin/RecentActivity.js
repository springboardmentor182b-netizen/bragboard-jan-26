import React from 'react';
import { Clock, MessageSquare, Award, Flag } from 'lucide-react';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'shoutout',
      user: 'Sarah J.',
      action: 'gave a shout-out to Mike C.',
      time: '2 minutes ago',
      icon: Award,
      iconColor: 'text-yellow-600',
      iconBg: 'bg-yellow-100'
    },
    {
      id: 2,
      type: 'comment',
      user: 'Emma W.',
      action: 'commented on a shout-out',
      time: '15 minutes ago',
      icon: MessageSquare,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100'
    },
    {
      id: 3,
      type: 'flag',
      user: 'Alex K.',
      action: 'flagged inappropriate content',
      time: '1 hour ago',
      icon: Flag,
      iconColor: 'text-red-600',
      iconBg: 'bg-red-100'
    },
    {
      id: 4,
      type: 'shoutout',
      user: 'Mike C.',
      action: 'gave a shout-out to Emma W.',
      time: '2 hours ago',
      icon: Award,
      iconColor: 'text-yellow-600',
      iconBg: 'bg-yellow-100'
    },
    {
      id: 5,
      type: 'comment',
      user: 'Sarah J.',
      action: 'commented on a shout-out',
      time: '3 hours ago',
      icon: MessageSquare,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
          <p className="text-sm text-gray-600 mt-1">Latest platform updates</p>
        </div>
        <Clock className="w-6 h-6 text-gray-400" />
      </div>

      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`${activity.iconBg} p-2 rounded-full flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${activity.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  <span className="font-semibold">{activity.user}</span> {activity.action}
                </p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>

      <button className="w-full mt-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
        View All Activity
      </button>
    </div>
  );
};

export default RecentActivity;
