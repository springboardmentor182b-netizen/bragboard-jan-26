import React, { useState, useEffect } from 'react';

const TopContributors = () => {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    fetchTopContributors();
  }, [timeRange]);

  const fetchTopContributors = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8000/api/admin/top-contributors?range=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setContributors(data.contributors || []);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching top contributors:', error);
      setLoading(false);
    }
  };

  const getMedalIcon = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '🏅';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Top Contributors</h3>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : contributors.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No data available yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contributors.map((contributor, index) => (
            <div 
              key={contributor.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3 flex-1">
                <span className="text-2xl">{getMedalIcon(index)}</span>
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                    {contributor.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{contributor.name}</p>
                    <p className="text-sm text-gray-500">{contributor.department}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-blue-600">
                  {contributor.shoutoutCount}
                </p>
                <p className="text-xs text-gray-500">shout-outs</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Based on number of shout-outs sent
        </p>
      </div>
    </div>
  );
};

export default TopContributors;