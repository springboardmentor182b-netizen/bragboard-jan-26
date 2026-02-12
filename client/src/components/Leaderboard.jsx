import React from 'react';
import { Trophy } from 'lucide-react';

const Leaderboard = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Trophy className="text-yellow-500" /> Top Contributors
      </h2>
      <div className="space-y-4">
        {data.map((user, index) => (
          <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-4">
              <span className={`font-bold text-lg w-8 ${index === 0 ? 'text-yellow-500' : 'text-gray-400'}`}>#{index + 1}</span>
              <div>
                <h3 className="font-bold text-gray-800">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.department}</p>
              </div>
            </div>
            <div className="text-indigo-600 font-bold">{user.score} pts</div>
          </div>
        ))}
        {data.length === 0 && <p className="text-gray-500">No shoutouts yet!</p>}
      </div>
    </div>
  );
};
export default Leaderboard;