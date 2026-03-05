// USER APPROVAL TAB COMPONENT
// Add this to AdminDashboard.jsx

import { useState, useEffect } from 'react';

function UserApprovalTab({ adminAPI }) {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  const loadPendingUsers = async () => {
    setLoading(true);
    try {
      const data = await adminAPI.getPendingUsers();
      setPendingUsers(data);
    } catch (err) {
      console.error('Failed to load pending users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingUsers();
  }, []);

  const handleApprove = async (userId, userName) => {
    if (!confirm(`Approve ${userName}?`)) return;
    
    setProcessing(userId);
    try {
      await adminAPI.approveUser(userId);
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
      alert(`✅ ${userName} has been approved and can now login!`);
    } catch (err) {
      alert(`Failed to approve user: ${err.message}`);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (userId, userName) => {
    if (!confirm(`Reject ${userName}? They will not be able to access the platform.`)) return;
    
    setProcessing(userId);
    try {
      await adminAPI.rejectUser(userId);
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
      alert(`❌ ${userName} has been rejected`);
    } catch (err) {
      alert(`Failed to reject user: ${err.message}`);
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF' }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
        <p>Loading pending users...</p>
      </div>
    );
  }

  if (pendingUsers.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '64px 24px',
        background: '#F9FAFB',
        borderRadius: '12px',
        border: '1px dashed #E5E7EB'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#374151', margin: '0 0 8px 0' }}>
          All caught up!
        </h3>
        <p style={{ fontSize: '14px', color: '#9CA3AF', margin: 0 }}>
          No pending user approvals at the moment
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', margin: '0 0 4px 0' }}>
          Pending Approvals
        </h3>
        <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
          {pendingUsers.length} user{pendingUsers.length !== 1 ? 's' : ''} waiting for approval
        </p>
      </div>

      {/* Pending Users Table */}
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
              <th style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontSize: '12px',
                fontWeight: 600,
                color: '#6B7280',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                User
              </th>
              <th style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontSize: '12px',
                fontWeight: 600,
                color: '#6B7280',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Email
              </th>
              <th style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontSize: '12px',
                fontWeight: 600,
                color: '#6B7280',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Department
              </th>
              <th style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontSize: '12px',
                fontWeight: 600,
                color: '#6B7280',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Joined
              </th>
              <th style={{
                padding: '12px 16px',
                textAlign: 'right',
                fontSize: '12px',
                fontWeight: 600,
                color: '#6B7280',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {pendingUsers.map((user, idx) => (
              <tr
                key={user.id}
                style={{
                  borderBottom: idx < pendingUsers.length - 1 ? '1px solid #F3F4F6' : 'none',
                  background: processing === user.id ? '#FEFCE8' : '#fff',
                  transition: 'background 0.2s'
                }}
              >
                {/* User Info */}
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '14px'
                    }}>
                      {(user.name || '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                        {user.name}
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: '#FBBF24',
                        background: '#FFFBEB',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        display: 'inline-block',
                        marginTop: '2px',
                        fontWeight: 600
                      }}>
                        ⏳ PENDING
                      </div>
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td style={{ padding: '16px' }}>
                  <div style={{ fontSize: '13px', color: '#6B7280' }}>
                    {user.email}
                  </div>
                </td>

                {/* Department */}
                <td style={{ padding: '16px' }}>
                  <div style={{ fontSize: '13px', color: '#6B7280' }}>
                    {user.department || '—'}
                  </div>
                </td>

                {/* Joined */}
                <td style={{ padding: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
                    {user.joined_at 
                      ? new Date(user.joined_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })
                      : '—'
                    }
                  </div>
                </td>

                {/* Actions */}
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => handleApprove(user.id, user.name)}
                      disabled={processing === user.id}
                      style={{
                        background: '#10B981',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 16px',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: processing === user.id ? 'not-allowed' : 'pointer',
                        opacity: processing === user.id ? 0.5 : 1,
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                      onMouseEnter={(e) => {
                        if (processing !== user.id) {
                          e.currentTarget.style.background = '#059669';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#10B981';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => handleReject(user.id, user.name)}
                      disabled={processing === user.id}
                      style={{
                        background: '#EF4444',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 16px',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: processing === user.id ? 'not-allowed' : 'pointer',
                        opacity: processing === user.id ? 0.5 : 1,
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                      onMouseEnter={(e) => {
                        if (processing !== user.id) {
                          e.currentTarget.style.background = '#DC2626';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#EF4444';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      ✕ Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserApprovalTab;
