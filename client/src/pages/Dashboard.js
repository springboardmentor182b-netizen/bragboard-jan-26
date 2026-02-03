import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  // Connect to your Python Backend
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/analytics')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error("Backend Error:", err));
  }, []);

  if (!data) return <div className="p-8">Loading Analytics...</div>;

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-6">
        {data.stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500 mb-1">{stat.title}</div>
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
            </div>
            <div className={`p-3 rounded-xl ${i === 0 ? 'bg-red-50 text-red-500' : i === 1 ? 'bg-purple-50 text-purple-500' : 'bg-emerald-50 text-emerald-500'}`}>
              {i === 0 ? <Heart /> : i === 1 ? <MessageCircle /> : <TrendingUp />}
            </div>
          </div>
        ))}
      </div>
      
      {/* Top Employees List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <h3 className="font-bold text-gray-800 mb-6 text-sm">Top Recognized Employees</h3>
        <div className="space-y-4">
          {data.top_employees.map((item) => (
            <div key={item.rank} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm">
                  {item.rank}
                </div>
                <span className="font-medium text-gray-700 text-sm">{item.name}</span>
              </div>
              <span className="text-xs text-gray-500 font-medium">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;