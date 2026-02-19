import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, Medal, Award, Flame } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { apiUrl } = useAuth();

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get(`${apiUrl}/leaderboard`);
                setLeaders(response.data);
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, [apiUrl]);

    const getRankIcon = (index) => {
        if (index === 0) return <Trophy className="text-yellow-500" fill="#EAB308" />;
        if (index === 1) return <Medal className="text-gray-400" fill="#9CA3AF" />;
        if (index === 2) return <Medal className="text-orange-500" fill="#F97316" />;
        return <span className="text-2xl font-bold text-gray-300">#{index + 1}</span>;
    };

    if (loading) return <div>Loading leaderboard...</div>;

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
