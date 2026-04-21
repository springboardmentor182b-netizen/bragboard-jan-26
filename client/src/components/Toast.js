import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: '#38a169',
    error: '#e53e3e',
    warning: '#ed8936'
  };

  return (
    <div className="toast" style={{ background: colors[type] }}>
      {message}
    </div>
  );
};

export default Toast;
