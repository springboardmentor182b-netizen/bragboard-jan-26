import React, { useState } from 'react';
import { Send, Inbox } from 'lucide-react';

const MyShoutoutsPage = () => {
  const [activeTab, setActiveTab] = useState('sent');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">My Shoutouts</h1>
        <p className="text-accent1">Track shoutouts you've sent and received</p>
      </div>

      <div className="bg-white rounded-lg shadow-md border-2 border-accent2">
        <div className="flex border-b-2 border-accent2">
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 font-semibold transition-colors ${
              activeTab === 'sent'
                ? 'bg-primary text-secondary'
                : 'text-accent1 hover:bg-secondary'
            }`}
          >
            <Send className="w-5 h-5" />
            Sent
          </button>
          <button
            onClick={() => setActiveTab('received')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 font-semibold transition-colors ${
              activeTab === 'received'
                ? 'bg-primary text-secondary'
                : 'text-accent1 hover:bg-secondary'
            }`}
          >
            <Inbox className="w-5 h-5" />
            Received
          </button>
        </div>

        <div className="p-6">
          <div className="text-center py-12">
            <p className="text-accent1">No {activeTab} shoutouts yet</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyShoutoutsPage;
