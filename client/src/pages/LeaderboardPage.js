import React from 'react';
import { Trophy, TrendingUp, Award } from 'lucide-react';

const LeaderboardPage = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Leaderboard</h1>
        <p className="text-accent1">Top contributors this month</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-md border-2 border-accent2 text-center">
          <div className="w-16 h-16 bg-accent1 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-secondary" />
          </div>
          <h3 className="font-semibold text-primary mb-1">Most Received</h3>
          <p className="text-2xl font-bold text-accent1">TBD</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md border-2 border-accent2 text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-secondary" />
          </div>
          <h3 className="font-semibold text-primary mb-1">Most Given</h3>
          <p className="text-2xl font-bold text-accent1">TBD</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md border-2 border-accent2 text-center">
          <div className="w-16 h-16 bg-accent1 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-secondary" />
          </div>
          <h3 className="font-semibold text-primary mb-1">Rising Star</h3>
          <p className="text-2xl font-bold text-accent1">TBD</p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-md border-2 border-accent2">
        <h2 className="text-xl font-bold text-primary mb-4">Rankings</h2>
        <div className="text-center py-12">
          <p className="text-accent1">Leaderboard data will be displayed here</p>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
