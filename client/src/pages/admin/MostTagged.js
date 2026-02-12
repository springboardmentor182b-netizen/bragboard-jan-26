import React, { useState, useEffect } from 'react';

const MostTagged = () => {
  const [mostTagged, setMostTagged] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    fetchMostTagged();
  }, [timeRange]);

  const fetchMostTagged = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8000/api/admin/most-tagged?range=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMostTagged(data.mostTagged || []);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching most tagged:', error);
      setLoading(false);
    }
  };

  const getStarCount = (count) => {
    if (count >= 20) return 5;
    if (count >= 15) return 4;
    if (count >= 10) return 3;
    if (count >= 5) return 2;
    return 1;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Most Recognized</h3>
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
      ) : mostTagged.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No data available yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {mostTagged.map((employee, index) => (
            <div 
              key={employee.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className="text-2xl font-bold text-gray-400">
                  #{index + 1}
                </div>
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {employee.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{employee.name}</p>
                    <p className="text-sm text-gray-500">{employee.department}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end mb-1">
                  {[...Array(getStarCount(employee.tagCount))].map((_, i) => (
                    <span key={i} className="text-yellow-400">⭐</span>
                  ))}
                </div>
                <p className="text-lg font-semibold text-purple-600">
                  {employee.tagCount}
                </p>
                <p className="text-xs text-gray-500">mentions</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Based on number of times tagged in shout-outs
        </p>
      </div>
    </div>
  );
};

export default MostTagged;