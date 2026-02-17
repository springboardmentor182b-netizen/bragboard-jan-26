import React from 'react';

const VARIANTS = {
  blue:   { backgroundColor: '#dbeafe', color: '#1d4ed8' },
  green:  { backgroundColor: '#dcfce7', color: '#15803d' },
  yellow: { backgroundColor: '#fef9c3', color: '#a16207' },
  red:    { backgroundColor: '#fee2e2', color: '#b91c1c' },
  gray:   { backgroundColor: '#f3f4f6', color: '#374151' },
  purple: { backgroundColor: '#ede9fe', color: '#6d28d9' },
};

/**
 * Small colored badge/tag component.
 */
function Badge({ label, variant = 'gray' }) {
  const style = VARIANTS[variant] || VARIANTS.gray;
  return (
    <span
      style={{
        ...style,
        display: 'inline-block',
        padding: '0.2rem 0.6rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '600',
      }}
    >
      {label}
    </span>
  );
}

export default Badge;
