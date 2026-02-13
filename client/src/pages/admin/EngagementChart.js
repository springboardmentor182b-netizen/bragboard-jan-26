import React from 'react';
import { BarChart3 } from 'lucide-react';

const EngagementChart = () => {
  // Sample data for the chart - In real app, this comes from API
  const chartData = [
    { day: 'Mon', value: 65 },
    { day: 'Tue', value: 78 },
    { day: 'Wed', value: 90 },
    { day: 'Thu', value: 72 },
    { day: 'Fri', value: 88 },
    { day: 'Sat', value: 45 },
    { day: 'Sun', value: 50 }
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Engagement Trends</h2>
          <p className="text-sm text-gray-600 mt-1">Weekly activity overview</p>
        </div>
        <BarChart3 className="w-6 h-6 text-blue-600" />
      </div>

      {/* Simple Bar Chart */}
      <div className="space-y-3">
        {chartData.map((data, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600 w-8">{data.day}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                style={{ width: `${(data.value / maxValue) * 100}%` }}
              >
                <span className="text-xs font-semibold text-white">{data.value}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between text-sm">
        <span className="text-gray-600">Average: 73%</span>
        <span className="text-green-600 font-semibold">↑ 12% from last week</span>
      </div>
    </div>
  );
};

export default EngagementChart;
