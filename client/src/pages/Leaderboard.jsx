import React from 'react';
import { Trophy, Medal, Award } from 'lucide-react';

const Leaderboard = () => {
    const leaders = [
        { name: 'Marcus Johnson', points: 1250, role: 'Product Designer', change: '+2' },
        { name: 'Sarah Chen', points: 1100, role: 'Frontend Dev', change: '-1' },
        { name: 'Jessica Wu', points: 950, role: 'Engineering Lead', change: '+5' },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-secondary-900 mb-2">Leaderboard</h1>
                <p className="text-secondary-500">Celebrating our top contributors this month</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-secondary-100 overflow-hidden">
                <div className="p-6 border-b border-secondary-100 bg-secondary-50/50 flex justify-between items-center">
                    <h2 className="font-bold text-lg text-secondary-900">Top Contributors</h2>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-white border border-secondary-200 rounded-lg text-sm font-medium text-secondary-600 shadow-sm">This Month</span>
                    </div>
                </div>

                <div className="divide-y divide-secondary-100">
                    {leaders.map((leader, index) => (
                        <div key={index} className="p-6 flex items-center gap-6 hover:bg-secondary-50 transition-colors">
                            <div className="font-bold text-xl text-secondary-400 w-8 text-center">#{index + 1}</div>

                            <div className="flex-1 flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm
                                    ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-400' : 'bg-secondary-200'}
                                `}>
                                    {index === 0 ? <Trophy size={20} /> : index === 1 ? <Medal size={20} /> : index === 2 ? <Award size={20} /> : index + 1}
                                </div>
                                <div>
                                    <h3 className="font-bold text-secondary-900">{leader.name}</h3>
                                    <p className="text-sm text-secondary-500">{leader.role}</p>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="font-bold text-xl text-primary-600">{leader.points} pts</div>
                                <div className="text-xs text-green-600 font-medium">{leader.change} positions</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
