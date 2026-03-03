import { useState, useEffect } from 'react';
import ShoutoutCard from '../components/ShoutoutCard';

export default function MyActivity() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Shout-outs Sent');

    const fetchData = async () => {
        setLoading(true);
        let url = '';
        if (activeTab === 'Shout-outs Sent' || activeTab === 'Shout-outs Received') {
            url = 'http://localhost:8000/shoutouts/mine';
        } else if (activeTab === 'Comments Sent') {
            url = 'http://localhost:8000/shoutouts/comments/mine?sent=true';
        } else if (activeTab === 'Comments Received') {
            url = 'http://localhost:8000/shoutouts/comments/mine?sent=false';
        }

        try {
            const response = await fetch(url);
            const result = await response.json();

            // Filter shoutouts locally if needed
            if (activeTab === 'Shout-outs Sent') {
                setData(result.filter(s => s.sender_id === 2));
            } else if (activeTab === 'Shout-outs Received') {
                setData(result.filter(s => s.receiver_id === 2));
            } else {
                setData(result);
            }
        } catch (err) {
            console.error('Error fetching activity:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h2 className="text-4xl font-black text-gray-900">My Activity</h2>
                <p className="text-gray-500 mt-2 text-lg">History of your interactions.</p>
            </div>

            <div className="flex gap-4 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                {['Shout-outs Sent', 'Shout-outs Received', 'Comments Sent', 'Comments Received'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all border whitespace-nowrap ${activeTab === tab
                                ? 'bg-gray-900 text-white border-gray-900 shadow-xl'
                                : 'bg-white text-gray-400 border-gray-100 hover:border-orange-200 hover:text-gray-600'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {loading ? (
                    [1, 2].map(i => (
                        <div key={i} className="h-64 bg-gray-100 rounded-[3rem] animate-pulse" />
                    ))
                ) : data.length > 0 ? (
                    data.map(item => (
                        activeTab.includes('Shout-out') ? (
                            <ShoutoutCard key={item.id} shoutout={item} onUpdate={fetchData} />
                        ) : (
                            <div key={item.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 relative group">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-[10px] font-black uppercase text-orange-500">Comment on shout-out #{item.shoutout_id}</span>
                                    <span className="text-[10px] font-bold text-gray-300 ml-auto">{new Date(item.created_at).toLocaleDateString()}</span>
                                </div>
                                <p className="text-gray-700 italic font-medium">"{item.message}"</p>
                                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs">👤</div>
                                    <span className="text-sm font-bold text-gray-500">{item.user?.email.split('@')[0]}</span>
                                </div>
                            </div>
                        )
                    ))
                ) : (
                    <div className="col-span-full bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-gray-100">
                        <div className="text-6xl mb-6">👻</div>
                        <h3 className="text-2xl font-bold text-gray-800">No {activeTab.toLowerCase()} found</h3>
                        <p className="text-gray-500 mt-2 max-w-sm mx-auto">Start interacting to see your progress here!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
