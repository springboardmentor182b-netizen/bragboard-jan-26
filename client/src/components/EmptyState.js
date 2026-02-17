import React from 'react';

/**
 * Shows a friendly empty state message.
 */
function EmptyState({ icon = '📭', title = 'Nothing here yet', subtitle = '' }) {
  return (
    <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
      <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>{icon}</div>
      <p style={{ fontWeight: '600', fontSize: '1rem', color: '#374151' }}>{title}</p>
      {subtitle && <p style={{ marginTop: '0.25rem', fontSize: '0.875rem' }}>{subtitle}</p>}
    </div>
  );
}

export default EmptyState;
