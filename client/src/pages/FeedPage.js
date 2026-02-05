import React, { useState, useEffect } from 'react';
import { MessageCircle, Heart, Award, Star } from 'lucide-react';
import { shoutoutService } from '../services/shoutoutService';
import { reactionService } from '../services/reactionService';
import { ReactionType } from '../constants/enums';

const FeedPage = () => {
  const [shoutouts, setShoutouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const data = await shoutoutService.getFeed();
      setShoutouts(data);
    } catch (err) {
      setError(err.detail || 'Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (shoutoutId, reactionType) => {
    try {
      await reactionService.addReaction(shoutoutId, reactionType);
      fetchFeed();
    } catch (err) {
      console.error('Failed to add reaction:', err);
    }
  };

  const ShoutoutCard = ({ shoutout }) => (
    <div className="bg-white rounded-lg p-6 shadow-md border-2 border-accent2 mb-4">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-secondary font-bold">
          {shoutout.sender?.name?.charAt(0) || 'U'}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-primary">{shoutout.sender?.name}</h3>
          <p className="text-sm text-accent1">{shoutout.sender?.department}</p>
          <p className="text-xs text-accent2 mt-1">
            {new Date(shoutout.created_at).toLocaleDateString()}
          </p>
        </div>
        <span className="px-3 py-1 bg-accent2 text-primary text-xs rounded-full">
          {shoutout.category}
        </span>
      </div>

      <p className="text-primary mb-4">{shoutout.message}</p>

      {shoutout.recipients && shoutout.recipients.length > 0 && (
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-sm text-accent1">To:</span>
          {shoutout.recipients.map((recipient) => (
            <span key={recipient.id} className="px-2 py-1 bg-secondary text-accent1 text-xs rounded-full">
              @{recipient.name}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-6 text-sm border-t border-accent2 pt-4">
        <button
          onClick={() => handleReaction(shoutout.id, ReactionType.LIKE)}
          className="flex items-center gap-1 text-accent1 hover:text-primary transition-colors"
        >
          <Heart className="w-5 h-5" />
          <span>{shoutout.reaction_counts?.like || 0}</span>
        </button>
        <button
          onClick={() => handleReaction(shoutout.id, ReactionType.CLAP)}
          className="flex items-center gap-1 text-accent1 hover:text-primary transition-colors"
        >
          <Award className="w-5 h-5" />
          <span>{shoutout.reaction_counts?.clap || 0}</span>
        </button>
        <button
          onClick={() => handleReaction(shoutout.id, ReactionType.STAR)}
          className="flex items-center gap-1 text-accent1 hover:text-primary transition-colors"
        >
          <Star className="w-5 h-5" />
          <span>{shoutout.reaction_counts?.star || 0}</span>
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-primary mb-8">Shoutout Feed</h1>
        <div className="text-center py-12">
          <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-accent1 mt-4">Loading feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Shoutout Feed</h1>
        <p className="text-accent1">See what everyone is celebrating!</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {shoutouts.length === 0 ? (
        <div className="bg-white rounded-lg p-6 shadow-md border-2 border-accent2">
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-accent2 mx-auto mb-4" />
            <p className="text-accent1 text-lg">No shoutouts yet</p>
            <p className="text-accent1 text-sm mt-2">Be the first to recognize someone!</p>
          </div>
        </div>
      ) : (
        <div>
          {shoutouts.map((shoutout) => (
            <ShoutoutCard key={shoutout.id} shoutout={shoutout} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedPage;
