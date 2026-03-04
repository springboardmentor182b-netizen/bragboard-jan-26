import { useState, useEffect } from 'react';
import ShoutoutCard from '../components/ShoutoutCard';

export default function Dashboard() {
    const [stats, setStats] = useState({ total_this_week: 0, top_value: 'Determining...', your_kudos: 0 });
    const [shoutouts, setShoutouts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, shoutoutsRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_URL}/shoutouts/stats`),
                    fetch(`${import.meta.env.VITE_API_URL}/shoutouts/`)
                ]);
                const statsData = await statsRes.json();
                const shoutoutsData = await shoutoutsRes.json();

                setStats(statsData);
                setShoutouts(shoutoutsData);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
                <p className="text-gray-500 mt-1">Here's what your team is celebrating today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:border-orange-200 transition-colors">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Shout-outs this week</p>
                    <div className="flex items-end gap-3">
                        <h3 className="text-4xl font-black text-gray-900">{stats.total_this_week}</h3>
                        <span className="mb-1 text-xs font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">+12%</span>
                    </div>
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-orange-50 rounded-full opacity-50 group-hover:scale-110 transition-transform" />
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:border-orange-200 transition-colors">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Top Value</p>
                    <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-black text-gray-900">{stats.top_value}</h3>
                        <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full uppercase">Trending</span>
                    </div>
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-50 rounded-full opacity-50 group-hover:scale-110 transition-transform" />
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:border-orange-200 transition-colors">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Your Kudos</p>
                    <div className="flex items-end gap-3">
                        <h3 className="text-4xl font-black text-gray-900">{stats.your_kudos}</h3>
                        <span className="mb-1 text-xs font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">Top 10%</span>
                    </div>
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-green-50 rounded-full opacity-50 group-hover:scale-110 transition-transform" />
                </div>
            </div>

            {/* Hero Leaderboard CTA */}
            <div className="bg-gradient-to-r from-orange-500 to-rose-500 rounded-[2.5rem] p-8 text-white flex items-center justify-between shadow-xl shadow-orange-200/50 cursor-pointer hover:scale-[1.01] transition-transform">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl">
                        🏆
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold">This Month's Leaderboard</h3>
                        <p className="text-white/80">See who's topping the charts!</p>
                    </div>
                </div>
                <svg className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
            </div>

            {/* Latest Shout-outs */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">Latest Shout-outs</h3>
                    <button className="text-sm font-bold text-gray-400 hover:text-orange-500 transition-colors">View All</button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-gray-100 rounded-3xl animate-pulse" />
                        ))}
                    </div>
                ) : shoutouts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {shoutouts.slice(0, 6).map((s) => (
                            <ShoutoutCard key={s.id} shoutout={s} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white p-12 rounded-[2.5rem] text-center border-2 border-dashed border-gray-100">
                        <div className="text-4xl mb-4">✨</div>
                        <h4 className="text-xl font-bold text-gray-800">No shout-outs yet</h4>
                        <p className="text-gray-500 mt-2 max-w-xs mx-auto">Be the first to recognize a colleague's hard work!</p>
                        <button className="mt-6 px-8 py-3 bg-gray-900 text-white font-bold rounded-2xl hover:bg-orange-500 transition-colors">Post a Shout-out</button>
                    </div>
                )}
            </div>
        </div>
    );
}
