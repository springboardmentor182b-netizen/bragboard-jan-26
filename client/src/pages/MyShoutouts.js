import React, { useState, useEffect } from 'react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const CURRENT_USER_ID = 1;

const MyShoutouts = () => {
  const [activeTab, setActiveTab] = useState('received');
  const [receivedShoutouts, setReceivedShoutouts] = useState([]);
  const [sentShoutouts, setSentShoutouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShoutouts();
  }, []);

  const fetchShoutouts = async () => {
    try {
      const [receivedRes, sentRes] = await Promise.all([
        fetch(`${API_BASE}/shoutouts/user/${CURRENT_USER_ID}/received`),
        fetch(`${API_BASE}/shoutouts/user/${CURRENT_USER_ID}/sent`)
      ]);
      
      const receivedData = await receivedRes.json();
      const sentData = await sentRes.json();
      
      setReceivedShoutouts(receivedData);
      setSentShoutouts(sentData);
    } catch (error) {
      console.error('Failed to fetch shoutouts:', error);
    }
    setLoading(false);
  };

  const ShoutoutCard = ({ shoutout, type }) => (
    <div className="bg-white rounded-lg p-6 border border-gray-200 mb-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-[#213555] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {shoutout.sender.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="flex-1 min-w-0">
          <div className="mb-2">
            <div className="flex items-center justify-between mb-1">
              <div>
                <p className="text-sm text-[#3E5879]">
                  {type === 'received' ? 'From:' : 'To:'}
                </p>
                <h3 className="font-semibold text-[#213555]">
                  {type === 'received' 
                    ? shoutout.sender.name 
                    : shoutout.recipients.map(r => r.name).join(', ')}
                </h3>
                <p className="text-sm text-[#3E5879]">
                  {type === 'received' 
                    ? shoutout.sender.email 
                    : shoutout.recipients.map(r => r.email).join(', ')}
                </p>
              </div>
              <span className="text-xs text-[#3E5879]">
                {new Date(shoutout.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
          
          <p className="text-[#213555] mb-3">{shoutout.message}</p>
          
          <div className="flex gap-2 flex-wrap">
            {shoutout.tags.map((tag, idx) => (
              <span key={idx} className="px-3 py-1 bg-[#D8C4B6] text-[#213555] text-xs rounded-full font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <h1 className="text-3xl font-bold text-[#213555]">My Shoutouts</h1>
        <p className="text-[#3E5879] mt-1">View all your sent and received shoutouts</p>
      </div>

      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-6 flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('received')}
            className={`pb-4 px-2 font-semibold transition-colors relative ${
              activeTab === 'received'
                ? 'text-[#213555]'
                : 'text-[#3E5879] hover:text-[#213555]'
            }`}
          >
            Shoutouts Received ({receivedShoutouts.length})
            {activeTab === 'received' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#213555]"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`pb-4 px-2 font-semibold transition-colors relative ${
              activeTab === 'sent'
                ? 'text-[#213555]'
                : 'text-[#3E5879] hover:text-[#213555]'
            }`}
          >
            Shoutouts Given ({sentShoutouts.length})
            {activeTab === 'sent' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#213555]"></div>
            )}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-[#213555] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : activeTab === 'received' ? (
          receivedShoutouts.length > 0 ? (
            receivedShoutouts.map(shoutout => (
              <ShoutoutCard key={shoutout.id} shoutout={shoutout} type="received" />
            ))
          ) : (
            <div className="bg-white rounded-lg p-12 border border-gray-200 text-center">
              <p className="text-[#3E5879]">You haven't received any shoutouts yet.</p>
            </div>
          )
        ) : (
          sentShoutouts.length > 0 ? (
            sentShoutouts.map(shoutout => (
              <ShoutoutCard key={shoutout.id} shoutout={shoutout} type="sent" />
            ))
          ) : (
            <div className="bg-white rounded-lg p-12 border border-gray-200 text-center">
              <p className="text-[#3E5879]">You haven't sent any shoutouts yet. Recognize someone today!</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MyShoutouts;
