import React, { useState, useEffect } from 'react';

const EngagementChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    fetchEngagementData();
  }, [timeRange]);

  const fetchEngagementData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8000/api/admin/engagement?range=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setChartData(data.engagement || []);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching engagement data:', error);
      setLoading(false);
    }
  };

  const getMaxValue = () => {
    if (chartData.length === 0) return 100;
    const max = Math.max(
      ...chartData.map(d => Math.max(d.shoutouts || 0, d.reactions || 0, d.comments || 0))
    );
    return Math.ceil(max / 10) * 10;
  };

  const maxValue = getMaxValue();

  const getBarHeight = (value) => {
    return (value / maxValue) * 100;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Engagement Overview</h3>
          <p className="text-sm text-gray-500 mt-1">Activity trends over time</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
          <option value="quarter">Last 3 Months</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : chartData.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No engagement data available</p>
        </div>
      ) : (
        <div>
          {/* Legend */}
          <div className="flex items-center justify-center space-x-6 mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm text-gray-600">Shout-outs</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <span className="text-sm text-gray-600">Reactions</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">Comments</span>
            </div>
          </div>

          {/* Chart */}
          <div className="relative">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500 w-8">
              <span>{maxValue}</span>
              <span>{Math.floor(maxValue * 0.75)}</span>
              <span>{Math.floor(maxValue * 0.5)}</span>
              <span>{Math.floor(maxValue * 0.25)}</span>
              <span>0</span>
            </div>

            {/* Chart area */}
            <div className="ml-12 mr-4">
              {/* Grid lines */}
              <div className="relative h-64 border-l border-b border-gray-200">
                <div className="absolute inset-0 flex flex-col justify-between">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="border-t border-gray-100"></div>
                  ))}
                </div>

                {/* Bars */}
                <div className="absolute inset-0 flex items-end justify-around px-2">
                  {chartData.map((day, index) => (
                    <div key={index} className="flex-1 flex items-end justify-center space-x-1 px-1">
                      {/* Shout-outs bar */}
                      <div className="relative group flex-1 max-w-[20px]">
                        <div
                          className="bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer"
                          style={{ height: `${getBarHeight(day.shoutouts || 0)}%` }}
                        ></div>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                          {day.shoutouts || 0} shout-outs
                        </div>
                      </div>

                      {/* Reactions bar */}
                      <div className="relative group flex-1 max-w-[20px]">
                        <div
                          className="bg-purple-500 rounded-t hover:bg-purple-600 transition-colors cursor-pointer"
                          style={{ height: `${getBarHeight(day.reactions || 0)}%` }}
                        ></div>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                          {day.reactions || 0} reactions
                        </div>
                      </div>

                      {/* Comments bar */}
                      <div className="relative group flex-1 max-w-[20px]">
                        <div
                          className="bg-green-500 rounded-t hover:bg-green-600 transition-colors cursor-pointer"
                          style={{ height: `${getBarHeight(day.comments || 0)}%` }}
                        ></div>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                          {day.comments || 0} comments
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* X-axis labels */}
              <div className="flex justify-around mt-2">
                {chartData.map((day, index) => (
                  <div key={index} className="flex-1 text-center">
                    <span className="text-xs text-gray-600">
                      {new Date(day.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {chartData.reduce((sum, day) => sum + (day.shoutouts || 0), 0)}
              </p>
              <p className="text-sm text-gray-500 mt-1">Total Shout-outs</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {chartData.reduce((sum, day) => sum + (day.reactions || 0), 0)}
              </p>
              <p className="text-sm text-gray-500 mt-1">Total Reactions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {chartData.reduce((sum, day) => sum + (day.comments || 0), 0)}
              </p>
              <p className="text-sm text-gray-500 mt-1">Total Comments</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EngagementChart;