import React from 'react';

/**
 * A stat summary card showing a number and a label.
 */
function StatCard({ label, value, icon, color = '#3b82f6' }) {
  return (
    <div
      style={{
        backgroundColor: '#fff',
        borderRadius: '0.75rem',
        padding: '1.25rem 1.5rem',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        flex: '1 1 180px',
      }}
    >
      {icon && (
        <div
          style={{
            width: 48, height: 48,
            borderRadius: '0.5rem',
            backgroundColor: `${color}22`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem',
          }}
        >
          {icon}
        </div>
      )}
      <div>
        <p style={{ fontSize: '1.75rem', fontWeight: '800', color }}>{value}</p>
        <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.1rem' }}>{label}</p>
      </div>
    </div>
  );
}

export default StatCard;
