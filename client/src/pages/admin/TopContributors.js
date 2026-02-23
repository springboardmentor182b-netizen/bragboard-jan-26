import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const TopContributors = () => {
  const [contributors, setContributors] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      initials: 'SJ',
      rank: 1,
      shoutouts: 32,
      growth: 12,
      color: 'bg-blue-600'
    },
    {
      id: 2,
      name: 'Mike Chen',
      initials: 'MC',
      rank: 2,
      shoutouts: 28,
      growth: 8,
      color: 'bg-purple-600'
    },
    {
      id: 3,
      name: 'Emma Wilson',
      initials: 'EW',
      rank: 3,
      shoutouts: 24,
      growth: 15,
      color: 'bg-green-600'
    },
    {
      id: 4,
      name: 'Alex Kumar',
      initials: 'AK',
      rank: 4,
      shoutouts: 20,
      growth: 5,
      color: 'bg-orange-600'
    }
  ]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Top Contributors</h2>
        <p className="text-sm text-gray-600 mt-1">Most active team members this month</p>
      </div>

      <div className="space-y-4">
        {contributors.map((contributor) => (
          <div
            key={contributor.id}
            className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              {/* Rank Badge */}
              <div className="w-8 h-8 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold text-sm">
                {contributor.rank}
              </div>

              {/* Avatar */}
              <div className={`w-12 h-12 ${contributor.color} bg-opacity-20 rounded-full flex items-center justify-center`}>
                <span className={`${contributor.color.replace('bg-', 'text-')} font-semibold`}>
                  {contributor.initials}
                </span>
              </div>

              {/* Name */}
              <span className="font-semibold text-gray-900">{contributor.name}</span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1 text-green-600">
                <ArrowUp className="w-4 h-4" />
                <span className="text-sm font-medium">+{contributor.growth}</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900">{contributor.shoutouts}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopContributors;
