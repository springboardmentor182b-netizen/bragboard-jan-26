import React, { useState, useEffect } from 'react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const ShoutoutFeed = () => {
  const [shoutouts, setShoutouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/shoutouts/feed`);
      const data = await response.json();
      setShoutouts(data);
    } catch (error) {
      console.error('Failed to fetch feed:', error);
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <h1 className="text-3xl font-bold text-[#213555]">Shoutout Feed</h1>
        <p className="text-[#3E5879] mt-1">See all the recognition happening across the company</p>
      </div>

      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#213555] mb-2">Recent Activity</h2>
          <p className="text-[#3E5879]">Latest shoutouts from the team</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-[#213555] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : shoutouts.length > 0 ? (
          shoutouts.map(shoutout => (
            <div key={shoutout.id} className="bg-white rounded-lg p-6 border border-gray-200 mb-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#213555] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {shoutout.sender.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-[#213555]">{shoutout.sender.name}</h3>
                      <span className="text-[#3E5879]">recognized</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {shoutout.recipients.map((recipient) => (
                        <div key={recipient.id} className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#D8C4B6] flex items-center justify-center text-[#213555] font-bold text-xs">
                            {recipient.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-sm font-semibold text-[#213555]">{recipient.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-[#213555] mb-3">{shoutout.message}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 flex-wrap">
                      {shoutout.tags.map((tag, idx) => (
                        <span key={idx} className="px-3 py-1 bg-[#D8C4B6] text-[#213555] text-xs rounded-full font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-[#3E5879] ml-4">
                      {new Date(shoutout.created_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg p-12 border border-gray-200 text-center">
            <p className="text-[#3E5879]">No shoutouts yet. Be the first to recognize someone!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoutoutFeed;
