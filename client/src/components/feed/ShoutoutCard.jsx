import React from 'react';
import { ThumbsUp, Heart, Star, MessageCircle, MoreHorizontal } from 'lucide-react';

const ShoutoutCard = ({ shoutout }) => {
    const { user, message, timeAgo, tags, reactions, comments, image } = shoutout;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-secondary-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                        <h3 className="font-bold text-secondary-900">{user.name}</h3>
                        <p className="text-secondary-500 text-sm">{user.role}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-secondary-400 text-sm">{timeAgo}</span>
                    <button className="text-secondary-400 hover:text-secondary-600">
                        <MoreHorizontal size={20} />
                    </button>
                </div>
            </div>

            <div className="flex gap-6">
                <div className="flex-1">
                    <p className="text-secondary-700 mb-4 leading-relaxed">"{message}"</p>

                    <div className="flex flex-wrap gap-2 mb-6">
                        {tags.map((tag, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-bold rounded-lg uppercase tracking-wide"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {image && (
                    <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                        <img src={image} alt="Shout-out attachment" className="w-full h-full object-cover" />
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between border-t border-secondary-100 pt-4 mt-2">
                <div className="flex gap-4">
                    <button className="flex items-center gap-1.5 text-secondary-500 hover:text-blue-600 transition-colors">
                        <div className="p-1 rounded-full bg-blue-50 text-blue-600">
                            <ThumbsUp size={14} fill="currentColor" />
                        </div>
                        <span className="text-sm font-medium">{reactions.likes}</span>
                    </button>

                    <button className="flex items-center gap-1.5 text-secondary-500 hover:text-red-600 transition-colors">
                        <div className="p-1 rounded-full bg-red-50 text-red-600">
                            <Heart size={14} fill="currentColor" />
                        </div>
                        <span className="text-sm font-medium">{reactions.hearts}</span>
                    </button>

                    <button className="flex items-center gap-1.5 text-secondary-500 hover:text-yellow-600 transition-colors">
                        <div className="p-1 rounded-full bg-yellow-50 text-yellow-500">
                            <Star size={14} fill="currentColor" />
                        </div>
                        <span className="text-sm font-medium">{reactions.stars}</span>
                    </button>
                </div>

                <button className="flex items-center gap-2 text-secondary-500 hover:text-secondary-900 transition-colors text-sm font-medium">
                    <MessageCircle size={18} />
                    {comments} comments
                </button>
            </div>
        </div>
    );
};

export default ShoutoutCard;
