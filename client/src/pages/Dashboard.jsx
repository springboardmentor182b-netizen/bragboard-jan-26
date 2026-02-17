import React from 'react';
import { User, Trophy, Star } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import LeaderboardBanner from '../components/dashboard/LeaderboardBanner';
import ShoutoutCard from '../components/feed/ShoutoutCard';

const Dashboard = () => {
    // Dummy Data
    const stats = [
        { title: 'Shout-outs this week', value: '24', trend: 'up', trendValue: '+12%', icon: null, color: null },
        { title: 'Top Value', value: 'Teamwork', trend: '', trendValue: 'Trending', icon: null, color: null }, // Need to handle "Trending" tag style differently in StatsCard if needed, but keeping simple for now
        { title: 'Your Kudos', value: '15', trend: 'up', trendValue: 'Top 10%', icon: null, color: null },
    ];

    const latestShoutouts = [
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
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-secondary-900 mb-2">Dashboard</h1>
                <p className="text-secondary-500">Here's what your team is celebrating today.</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <StatsCard key={index} {...stat} />
                ))}
            </div>

            {/* Banner */}
            <LeaderboardBanner />

            {/* Latest Shout-outs */}
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-secondary-900">Latest Shout-outs</h2>
                <button className="text-sm font-semibold text-secondary-500 hover:text-primary-600 transition-colors">
                    View All
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {latestShoutouts.map(shoutout => (
                    <ShoutoutCard key={shoutout.id} shoutout={shoutout} />
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
