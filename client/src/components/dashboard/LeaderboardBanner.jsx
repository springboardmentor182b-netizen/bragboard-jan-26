import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ArrowRight } from 'lucide-react';

const LeaderboardBanner = () => {
    return (
        <div className="w-full bg-gradient-to-r from-primary-500 to-red-500 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg mb-8">
            <div className="relative z-10 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <Trophy size={24} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-bold">This Month's Leaderboard</h2>
                    </div>
                    <p className="text-primary-50 text-lg opacity-90">See who's topping the charts!</p>
                </div>

                <Link to="/leaderboard" className="bg-white text-primary-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-50 transition-colors shadow-sm">
                    View Leaderboard
                    <ArrowRight size={18} />
                </Link>
            </div>

            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>
        </div>
    );
};

export default LeaderboardBanner;
