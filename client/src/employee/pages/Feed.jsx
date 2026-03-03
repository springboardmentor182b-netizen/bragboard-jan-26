import { useState, useEffect } from 'react';
import ShoutoutCard from '../components/ShoutoutCard';

export default function Feed() {
    const [shoutouts, setShoutouts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFeed = () => {
        fetch('http://localhost:8000/shoutouts/')
            .then(res => res.json())
            .then(data => {
                setShoutouts(data);
                setLoading(false);
            })
            .catch(err => console.error('Error fetching feed:', err));
    };

    useEffect(() => {
        fetchFeed();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-end justify-between">
                <div>
                    <h2 className="text-4xl font-black text-gray-900">Recognition Feed</h2>
                    <p className="text-gray-500 mt-2 text-lg">See all the appreciation happening across the company.</p>
                </div>
            </div>

            <div className="space-y-6">
                {loading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="h-48 bg-gray-100 rounded-[2.5rem] animate-pulse" />
                    ))
                ) : shoutouts.length > 0 ? (
                    shoutouts.map(shoutout => (
                        <ShoutoutCard key={shoutout.id} shoutout={shoutout} onUpdate={fetchFeed} />
                    ))
                ) : (
                    <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-gray-100">
                        <div className="text-6xl mb-6">🏜️</div>
                        <h3 className="text-2xl font-bold text-gray-800">The feed is quiet...</h3>
                        <p className="text-gray-500 mt-2 max-w-sm mx-auto">Be the one to spark some joy by giving someone a shout-out!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
