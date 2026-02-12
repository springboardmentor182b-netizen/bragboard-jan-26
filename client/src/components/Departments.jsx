import React from 'react';
import { Users } from 'lucide-react';

const Departments = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {data.map((dept, idx) => (
        <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-lg text-gray-800">{dept.name}</h3>
            <Users className="text-gray-400" size={20} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Team Size</span>
              <span className="font-medium">{dept.member_count} members</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Shout-outs</span>
              <span className="font-medium text-indigo-600">{dept.shoutout_count}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default Departments;