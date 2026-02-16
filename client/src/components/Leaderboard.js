import React from 'react';
import { Trophy, Medal, Award, Flame } from 'lucide-react';

const Leaderboard = () => {
    // Dummy data
    const leaders = [
        { id: 1, name: 'Sarah Johnson', sent: 45, received: 38, reactions: 256, points: 339 },
        { id: 2, name: 'Mike Chen', sent: 38, received: 42, reactions: 245, points: 325 },
        { id: 3, name: 'Emily Watson', sent: 42, received: 35, reactions: 234, points: 311 },
        { id: 4, name: 'Alex Rodriguez', sent: 35, received: 30, reactions: 198, points: 263 },
    ];

    const getRankIcon = (index) => {
        if (index === 0) return <Trophy className="text-yellow-500" fill="#EAB308" />;
        if (index === 1) return <Medal className="text-gray-400" fill="#9CA3AF" />;
        if (index === 2) return <Medal className="text-orange-500" fill="#F97316" />;
        return <span className="text-2xl font-bold text-gray-300">#{index + 1}</span>;
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    Leaderboard <Trophy className="text-brand-orange" />
                </h1>
                <p className="text-gray-500 mt-1">Top performers in team recognition</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-brand-orange rounded-xl flex items-center justify-center">
                        <Trophy className="text-white" size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Top Contributors</h2>
                        <p className="text-sm text-gray-500">Based on sent, received, and engagement</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {leaders.map((leader, index) => (
                        <div key={leader.id} className="flex items-center p-4 rounded-xl border border-gray-50 bg-brand-light-bg/30 hover:bg-brand-light-bg transition-colors">
                            <div className="w-12 flex justify-center">
                                {getRankIcon(index)}
                            </div>

                            <div className="ml-4 w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold text-lg">
                                {leader.name.charAt(0)}
                            </div>

                            <div className="ml-4 flex-1">
                                <h3 className="font-bold text-gray-900">{leader.name}</h3>
                                <div className="flex gap-4 text-xs text-gray-500 mt-1">
                                    <span className="flex items-center gap-1"><Trophy size={12} className="text-brand-orange" /> {leader.sent} sent</span>
                                    <span className="flex items-center gap-1"><Award size={12} className="text-brand-orange" /> {leader.received} received</span>
                                    <span className="flex items-center gap-1"><Flame size={12} className="text-purple-500" /> {leader.reactions} reactions</span>
                                </div>
                            </div>

                            <div className="bg-brand-orange text-white px-4 py-1.5 rounded-full font-bold text-sm shadow-sm">
                                {leader.points} pts
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
