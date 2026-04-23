import React, { useState, useEffect } from 'react';
import api from '../services/api';

function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchUnreadCount();
    // Poll every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get('/notifications/unread-count');
      setUnreadCount(res.data.unread_count);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications/', { params: { limit: 10 } });
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  const handleBellClick = () => {
    if (!showDropdown) {
      fetchNotifications();
    }
    setShowDropdown(!showDropdown);
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      fetchUnreadCount();
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post('/notifications/mark-all-read');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Bell Button */}
      <button
        onClick={handleBellClick}
        style={{
          position: 'relative',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: '24px',
          padding: '8px',
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              background: '#EF4444',
              color: '#fff',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              fontSize: '11px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            width: '360px',
            maxHeight: '500px',
            overflowY: 'auto',
            background: '#fff',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            marginTop: '8px',
            zIndex: 1000,
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px',
              borderBottom: '1px solid #E5E7EB',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#4F46E5',
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          {notifications.length === 0 ? (
            <div
              style={{
                padding: '40px',
                textAlign: 'center',
                color: '#9CA3AF',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '8px' }}>🔕</div>
              <p style={{ margin: 0 }}>No notifications yet</p>
            </div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => !notif.is_read && markAsRead(notif.id)}
                style={{
                  padding: '16px',
                  borderBottom: '1px solid #F3F4F6',
                  background: notif.is_read ? '#fff' : '#EEF2FF',
                  cursor: notif.is_read ? 'default' : 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '4px',
                  }}
                >
                  <strong style={{ fontSize: '14px', color: '#111827' }}>
                    {notif.title}
                  </strong>
                  {!notif.is_read && (
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#4F46E5',
                        flexShrink: 0,
                        marginLeft: '8px',
                      }}
                    />
                  )}
                </div>
                <p
                  style={{
                    margin: '0 0 8px 0',
                    fontSize: '13px',
                    color: '#6B7280',
                  }}
                >
                  {notif.message}
                </p>
                <span style={{ fontSize: '11px', color: '#9CA3AF' }}>
                  {new Date(notif.created_at).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;