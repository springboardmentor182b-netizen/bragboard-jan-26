import React, { useState } from 'react';
import ShoutoutCard from '../components/feed/ShoutoutCard';

const Feed = () => {
    const [activeTab, setActiveTab] = useState('All');
    const tabs = ['All', 'My Team', 'Department'];

    // Dummy Data (Duplicated from Dashboard for now, typically would fetch from API)
    const shoutouts = [
        {
            id: 1,
            user: {
                name: 'Marcus Johnson',
                role: 'Product Designer',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus'
            },
            timeAgo: '2 hours ago',
            message: "Huge thanks for stepping in to help with the Q3 presentation deck! Your eye for detail is unmatched.",
            tags: ['Teamwork', 'Design'],
            reactions: { likes: 12, hearts: 5, stars: 2 },
            comments: 3,
            image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1632&q=80'
        },
        {
            id: 2,
            user: {
                name: 'Jessica Wu',
                role: 'Engineering Lead',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica'
            },
            timeAgo: '4 hours ago',
            message: "Congratulations on the successful launch of the new API! The stability improvements are incredible.",
            tags: ['Launch', 'Engineering'],
            reactions: { likes: 24, hearts: 10, stars: 8 },
            comments: 5,
            image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
        },
        {
            id: 3,
            user: {
                name: 'Emily Davis',
                role: 'Customer Success',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily'
            },
            timeAgo: 'Yesterday',
            message: "Thank you for handling that difficult client escalation with such grace and empathy. You're a lifesaver!",
            tags: ['Customer Love', 'Support'],
            reactions: { likes: 8, hearts: 15, stars: 1 },
            comments: 1,
            image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
        }
    ];

    return (
        <div className="pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-secondary-900 mb-2">Recognition Feed</h1>
                    <p className="text-secondary-500">See all the appreciation happening across the company.</p>
                </div>

                {/* Filter Tabs */}
                <div className="flex bg-white p-1 rounded-xl border border-secondary-200 shadow-sm">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab
                                    ? 'bg-primary-50 text-error-600 shadow-sm' // Using error-600 to match design's orange text, likely primary-600 actually
                                    : 'text-secondary-500 hover:text-secondary-700 hover:bg-secondary-50'
                                }`}
                            style={activeTab === tab ? { color: '#ea580c', backgroundColor: '#fff7ed' } : {}} // Explicit orange for active tab
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                {shoutouts.map(shoutout => (
                    <ShoutoutCard key={shoutout.id} shoutout={shoutout} />
                ))}
            </div>
        </div>
    );
};

export default Feed;
