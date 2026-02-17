import React from 'react';
import buildAvatarInitials from '../utils/buildAvatarInitials';
import buildAvatarColor from '../utils/buildAvatarColor';

/**
 * Circular avatar showing user initials with a deterministic color.
 */
function Avatar({ name = '', size = 40 }) {
  const initials = buildAvatarInitials(name);
  const bgColor  = buildAvatarColor(name);

  return (
    <div
      title={name}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: bgColor,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '700',
        fontSize: size * 0.38,
        flexShrink: 0,
        userSelect: 'none',
      }}
    >
      {initials}
    </div>
  );
}

export default Avatar;
