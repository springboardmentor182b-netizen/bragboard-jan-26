import React from 'react';
import { REACTION_TYPES } from '../data/constants';

/**
 * Displays like/clap/star reaction counts for a shoutout.
 */
function ReactionBar({ reactionCounts = {} }) {
  return (
    <div style={{ display: 'flex', gap: '0.75rem' }}>
      {Object.entries(REACTION_TYPES).map(([type, { emoji, label }]) => (
        <span
          key={type}
          title={label}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontSize: '0.875rem',
            color: '#6b7280',
            backgroundColor: '#f3f4f6',
            padding: '0.2rem 0.6rem',
            borderRadius: '9999px',
          }}
        >
          {emoji}
          <span style={{ fontWeight: '600', color: '#374151' }}>
            {reactionCounts[type] || 0}
          </span>
        </span>
      ))}
    </div>
  );
}

export default ReactionBar;
