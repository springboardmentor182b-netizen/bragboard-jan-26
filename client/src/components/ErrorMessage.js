import React from 'react';

/**
 * Displays an error message box.
 */
function ErrorMessage({ message = 'Something went wrong.' }) {
  return (
    <div
      style={{
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '0.5rem',
        padding: '1rem 1.25rem',
        color: '#b91c1c',
        fontSize: '0.875rem',
      }}
    >
      ⚠️ {message}
    </div>
  );
}

export default ErrorMessage;
