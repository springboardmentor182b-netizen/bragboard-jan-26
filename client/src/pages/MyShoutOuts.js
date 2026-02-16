import React from 'react';
import ShoutOutFeed from '../components/ShoutOutFeed';

const MyShoutOuts = () => {
    // Hardcoded current user ID = 1
    const currentUserId = 1;

    return (
        <div>
            <div className="max-w-3xl mx-auto mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Shout Outs 📝</h1>
                <p className="text-gray-500 mt-1">Shout-outs sent by you</p>
            </div>

            <ShoutOutFeed userId={currentUserId} />
        </div>
    );
};

export default MyShoutOuts;
