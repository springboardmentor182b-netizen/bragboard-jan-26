import React from 'react';
import { MessageCircle } from 'lucide-react';

const FeedPage = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Shoutout Feed</h1>
        <p className="text-accent1">See what everyone is celebrating!</p>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-md border-2 border-accent2">
        <div className="text-center py-12">
          <MessageCircle className="w-16 h-16 text-accent2 mx-auto mb-4" />
          <p className="text-accent1 text-lg">No shoutouts yet</p>
          <p className="text-accent1 text-sm mt-2">Be the first to recognize someone!</p>
        </div>
      </div>
    </div>
  );
};

export default FeedPage;
