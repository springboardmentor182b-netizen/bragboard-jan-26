import React from 'react';
import ShoutOutFeed from '../components/ShoutOutFeed';
import { useAuth } from '../context/AuthContext';

const MyShoutOuts = () => {
    const { user } = useAuth();

    if (!user) return <div>Please log in.</div>;

    return (
        <div>
            <div className="max-w-3xl mx-auto mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Shout Outs 📝</h1>
                <p className="text-gray-500 mt-1">Shout-outs sent by you</p>
            </div>

            <ShoutOutFeed userId={user.id} />
        </div>
    );
};

export default MyShoutOuts;
