import React from 'react';

const MyShoutouts = () => {
  return (
    <div className="bg-white border-b border-gray-200 px-8 py-6">
      <h1 className="text-3xl font-bold text-[#213555]">My Shoutouts</h1>
      <p className="text-[#3E5879] mt-1">View all shoutouts you've received</p>
      
      <div className="mt-8">
        <p className="text-gray-500">No shoutouts yet.</p>
      </div>
    </div>
  );
};

export default MyShoutouts;
