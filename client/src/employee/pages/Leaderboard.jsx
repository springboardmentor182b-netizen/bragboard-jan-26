import { useState, useEffect } from 'react';

export default function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/users/leaderboard`)
            .then(res => res.json())
            .then(data => {
                setLeaderboard(data);
                setLoading(false);
            })
            .catch(err => console.error('Error fetching leaderboard:', err));
    }, []);

    const top3 = leaderboard.slice(0, 3);
    const others = leaderboard.slice(3);

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center">
                <h2 className="text-4xl font-black text-gray-900 flex items-center justify-center gap-3">
                    Leaderboard 🏆
                </h2>
                <p className="text-gray-500 mt-2 text-lg">Top contributors for this month</p>
            </div>

            {loading ? (
                <div className="flex justify-center items-end gap-8 h-64 bg-gray-50 rounded-[3rem] animate-pulse" />
            ) : (
                <div className="space-y-16">
                    {/* Top 3 Podium */}
                    <div className="flex flex-col md:flex-row items-end justify-center gap-6 md:gap-12 px-4">
                        {/* 2nd Place */}
                        {top3[1] && (
                            <div className="flex flex-col items-center group cursor-pointer hover:scale-105 transition-transform order-2 md:order-1">
                                <div className="relative mb-4">
                                    <img
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${top3[1].email}`}
                                        className="w-24 h-24 rounded-full border-4 border-slate-300 p-1 bg-white shadow-xl"
                                    />
                                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-slate-400 rounded-full flex items-center justify-center text-white font-black text-xs shadow-lg">2</div>
                                </div>
                                <h4 className="font-bold text-gray-900">{top3[1].email.split('@')[0]}</h4>
                                <p className="text-orange-600 font-extrabold text-lg">{top3[1].points} pts</p>
                            </div>
                        )}

                        {/* 1st Place */}
                        {top3[0] && (
                            <div className="flex flex-col items-center group cursor-pointer hover:scale-110 transition-transform order-1 md:order-2">
                                <div className="text-4xl mb-2 animate-bounce">👑</div>
                                <div className="relative mb-4">
                                    <div className="absolute -inset-2 bg-gradient-to-tr from-orange-400 to-rose-400 rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity" />
                                    <img
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${top3[0].email}`}
                                        className="w-32 h-32 rounded-full border-4 border-orange-400 p-1 bg-white relative shadow-2xl"
                                    />
                                    <div className="absolute -top-3 -right-3 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-black shadow-xl ring-4 ring-white">1</div>
                                </div>
                                <h4 className="font-black text-xl text-gray-900 uppercase tracking-tight">{top3[0].email.split('@')[0]}</h4>
                                <p className="text-orange-600 font-black text-2xl">{top3[0].points} pts</p>
                            </div>
                        )}

                        {/* 3rd Place */}
                        {top3[2] && (
                            <div className="flex flex-col items-center group cursor-pointer hover:scale-105 transition-transform order-3">
                                <div className="relative mb-4">
                                    <img
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${top3[2].email}`}
                                        className="w-24 h-24 rounded-full border-4 border-amber-600 p-1 bg-white shadow-lg"
                                    />
                                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-amber-700 rounded-full flex items-center justify-center text-white font-black text-xs shadow-lg">3</div>
                                </div>
                                <h4 className="font-bold text-gray-900">{top3[2].email.split('@')[0]}</h4>
                                <p className="text-orange-600 font-extrabold text-lg">{top3[2].points} pts</p>
                            </div>
                        )}
                    </div>

                    {/* Leaderboard List */}
                    {others.length > 0 && (
                        <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
                            {others.map((user, index) => (
                                <div key={user.user_id} className="flex items-center justify-between p-6 hover:bg-orange-50/30 transition-colors group">
                                    <div className="flex items-center gap-6">
                                        <span className="w-8 text-xl font-black text-gray-300 group-hover:text-orange-500 transition-colors">{index + 4}</span>
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                                                className="w-12 h-12 rounded-full border-2 border-gray-100 p-0.5 group-hover:border-orange-200"
                                            />
                                            <div>
                                                <h4 className="font-bold text-gray-900">{user.email.split('@')[0]}</h4>
                                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{user.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right px-4">
                                        <p className="text-orange-600 font-black text-xl">{user.points} pts</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
