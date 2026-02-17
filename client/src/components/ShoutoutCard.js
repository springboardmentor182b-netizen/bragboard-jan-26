import React, { useState } from 'react';
import Avatar from './Avatar';
import ReactionBar from './ReactionBar';
import Badge from './Badge';
import timeAgo from '../utils/timeAgo';

/**
 * Card displaying a single shoutout with sender, recipients,
 * message, reactions, and collapsible comments.
 */
function ShoutoutCard({ shoutout }) {
  const [showComments, setShowComments] = useState(false);

  if (!shoutout) return null;

  return (
    <div
      style={{
        backgroundColor: '#fff',
        borderRadius: '0.75rem',
        padding: '1.25rem 1.5rem',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        marginBottom: '1rem',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <Avatar name={shoutout.sender_name} size={40} />
        <div>
          <p style={{ fontWeight: '700', fontSize: '0.95rem' }}>{shoutout.sender_name}</p>
          {shoutout.sender_department && (
            <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{shoutout.sender_department}</p>
          )}
        </div>
        <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#9ca3af' }}>
          {timeAgo(shoutout.created_at)}
        </span>
      </div>

      {/* Recipients */}
      {shoutout.recipients && shoutout.recipients.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>To:</span>
          {shoutout.recipients.map((r) => (
            <Badge key={r.id} label={r.name} variant="blue" />
          ))}
        </div>
      )}

      {/* Message */}
      <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#1f2937', marginBottom: '1rem' }}>
        {shoutout.message}
      </p>

      {/* Reactions */}
      <ReactionBar reactionCounts={shoutout.reaction_counts} />

      {/* Comments */}
      {shoutout.total_comments > 0 && (
        <div style={{ marginTop: '0.75rem' }}>
          <button
            onClick={() => setShowComments((s) => !s)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#3b82f6', fontSize: '0.8rem', fontWeight: '600',
            }}
          >
            {showComments ? '▲ Hide' : '▼ Show'} {shoutout.total_comments} comment{shoutout.total_comments !== 1 ? 's' : ''}
          </button>

          {showComments && (
            <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {shoutout.comments.map((c) => (
                <div
                  key={c.id}
                  style={{
                    display: 'flex', gap: '0.6rem',
                    backgroundColor: '#f9fafb',
                    borderRadius: '0.5rem',
                    padding: '0.6rem 0.75rem',
                  }}
                >
                  <Avatar name={c.user_name} size={28} />
                  <div>
                    <p style={{ fontWeight: '600', fontSize: '0.8rem' }}>{c.user_name}</p>
                    <p style={{ fontSize: '0.85rem', color: '#374151' }}>{c.content}</p>
                    <p style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '0.2rem' }}>
                      {timeAgo(c.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ShoutoutCard;
