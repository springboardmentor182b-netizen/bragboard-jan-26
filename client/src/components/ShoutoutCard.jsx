import React, { useState } from 'react';
import { Heart, MessageCircle, Star } from 'lucide-react';
import { config } from '../config/env';

const API_URL = config.apiBaseUrl;

const ShoutoutCard = ({ data }) => {
  const tags = data.tags ? data.tags.split(',') : [];

  // 1. Local state to show updates instantly
  const [likes, setLikes] = useState(data.likes || 0);
  const [isLiked, setIsLiked] = useState(false); // Just for visual color effect

  const handleLike = async () => {
    // 2. Call the API
    try {
      const response = await fetch(`${API_URL}/shoutouts/${data.id}/like`, {
        method: 'PUT',
      });

      if (response.ok) {
        // 3. Update the number on screen
        setLikes(prev => prev + 1);
        setIsLiked(true);
      }
    } catch (error) {
      console.error("Failed to like:", error);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4 transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg">
            {data.sender.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
              {data.sender.name}
              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                <Star size={10} /> Featured
              </span>
            </h3>
            <p className="text-gray-400 text-sm">
              {new Date(data.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <p className="text-gray-600 mb-4 leading-relaxed">{data.message}</p>

      <div className="flex gap-2 mb-6 flex-wrap">
        {tags.map((tag, idx) => (
          <span key={idx} className="bg-gray-50 border border-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-6 border-t border-gray-50 pt-4">
        {/* LIKE BUTTON */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 transition-colors group ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
        >
          <Heart size={20} className={`transition-all ${isLiked ? 'fill-red-500 scale-110' : 'group-hover:fill-red-500'}`} />
          <span className="text-sm font-medium">{likes} Likes</span>
        </button>

        {/* COMMENT BUTTON (Kept visual for now as logic is complex) */}
        <button className="flex items-center gap-2 text-gray-400 hover:text-indigo-600 transition-colors">
          <MessageCircle size={20} />
          <span className="text-sm font-medium">Comments</span>
        </button>
      </div>
    </div>
  );
};

export default ShoutoutCard;