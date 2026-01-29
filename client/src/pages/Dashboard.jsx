import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Mock data for demonstration
  const shoutouts = [
    {
      id: 1,
      author: user?.name || 'Sarah Johnson',
      authorInitials: user?.name?.split(' ').map(n => n[0]).join('') || 'SJ',
      timeAgo: '2 hours ago',
      message: 'Huge props to Mike for staying late to help fix that critical bug! Your dedication saved the day and kept our release on track. True team player! 💪',
      recipient: '@Mike Chen',
      tags: ['Teamwork', 'Problem Solving'],
      likes: 12,
      comments: 2,
      featured: true
    },
    {
      id: 2,
      author: 'David Kim',
      authorInitials: 'DK',
      timeAgo: '5 hours ago',
      message: "Shoutout to Emily for leading that amazing client presentation! Your preparation and clarity impressed everyone. We couldn't have done it without you!",
      recipient: '@Emily Rodriguez',
      tags: ['Leadership', 'Communication'],
      likes: 8,
      comments: 1,
      featured: false
    }
  ];

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#F1F5F9',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* Top Navigation Bar */}
      <nav style={{ 
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ 
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '64px'
        }}>
          {/* Left: Logo & Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '18px'
            }}>
              B
            </div>
            <div>
              <h1 style={{ 
                fontSize: '20px',
                fontWeight: 700,
                color: '#1F2937',
                margin: 0,
                lineHeight: 1.2
              }}>
                BragBoard
              </h1>
              <p style={{ 
                fontSize: '12px',
                color: '#6B7280',
                fontWeight: 400,
                margin: 0
              }}>
                Celebrate your team's wins
              </p>
            </div>
          </div>

          {/* Right: User Profile & Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '14px'
              }}>
                {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
              </div>
              <div>
                <div style={{ 
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#1F2937'
                }}>
                  {user?.name || 'User'}
                </div>
                <div style={{ 
                  fontSize: '12px',
                  color: '#6B7280',
                  fontWeight: 400
                }}>
                  {user?.role === 'admin' ? 'Admin' : 'Employee'}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                color: '#6B7280',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#D1D5DB';
                e.target.style.backgroundColor = '#F9FAFB';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#E5E7EB';
                e.target.style.backgroundColor = '#FFFFFF';
              }}
            >
              ↗ Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ 
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '32px 24px'
      }}>
        {/* Welcome Hero Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #4F46E5 0%, #10B981 100%)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          color: '#FFFFFF'
        }}>
          <h2 style={{ 
            fontSize: '32px',
            fontWeight: 700,
            margin: '0 0 8px 0'
          }}>
            Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
          </h2>
          <p style={{ 
            fontSize: '16px',
            fontWeight: 400,
            margin: 0,
            opacity: 0.9
          }}>
            Ready to celebrate your team's achievements today?
          </p>
        </div>

        {/* Recognition Feed Section */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <div>
              <h3 style={{ 
                fontSize: '24px',
                fontWeight: 700,
                color: '#1F2937',
                margin: '0 0 4px 0'
              }}>
                Recognition Feed
              </h3>
              <p style={{ 
                fontSize: '14px',
                color: '#6B7280',
                fontWeight: 400,
                margin: 0
              }}>
                Celebrate your team's achievements
              </p>
            </div>

            <button
              style={{
                padding: '12px 24px',
                backgroundColor: '#4F46E5',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(79, 70, 229, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#4338CA';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#4F46E5';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 4px rgba(79, 70, 229, 0.2)';
              }}
            >
              + Create Shoutout
            </button>
          </div>

          {/* Search and Filter */}
          <div style={{ 
            display: 'flex',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                type="text"
                placeholder="Search shoutouts..."
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: '#FFFFFF',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#4F46E5';
                  e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E5E7EB';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <span style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9CA3AF',
                fontSize: '16px'
              }}>
                🔍
              </span>
            </div>

            <select
              style={{
                padding: '12px 16px',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: '#FFFFFF',
                color: '#6B7280',
                fontWeight: 500,
                cursor: 'pointer',
                minWidth: '180px',
                outline: 'none'
              }}
            >
              <option>All Categories</option>
              <option>Teamwork</option>
              <option>Leadership</option>
              <option>Problem Solving</option>
            </select>
          </div>

          {/* Shoutout Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {shoutouts.map((shoutout) => (
              <div
                key={shoutout.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '24px',
                  border: shoutout.featured ? '2px solid #10B981' : '1px solid #E5E7EB',
                  boxShadow: shoutout.featured ? '0 4px 12px rgba(16, 185, 129, 0.1)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Author Header */}
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontWeight: 600,
                      fontSize: '16px'
                    }}>
                      {shoutout.authorInitials}
                    </div>
                    <div>
                      <div style={{ 
                        fontSize: '15px',
                        fontWeight: 600,
                        color: '#1F2937',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        {shoutout.author}
                        {shoutout.featured && (
                          <span style={{
                            backgroundColor: '#10B981',
                            color: '#FFFFFF',
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '2px 8px',
                            borderRadius: '12px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            ⭐ Featured
                          </span>
                        )}
                      </div>
                      <div style={{ 
                        fontSize: '13px',
                        color: '#9CA3AF',
                        fontWeight: 400
                      }}>
                        {shoutout.timeAgo}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <p style={{
                  fontSize: '15px',
                  color: '#374151',
                  lineHeight: '1.6',
                  margin: '0 0 12px 0',
                  fontWeight: 400
                }}>
                  {shoutout.message}
                </p>

                {/* Recipient */}
                <div style={{
                  fontSize: '13px',
                  color: '#6B7280',
                  marginBottom: '12px',
                  fontWeight: 500
                }}>
                  Shoutout to:{' '}
                  <span style={{
                    color: '#4F46E5',
                    backgroundColor: '#EEF2FF',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontWeight: 600
                  }}>
                    {shoutout.recipient}
                  </span>
                </div>

                {/* Tags */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  marginBottom: '16px',
                  flexWrap: 'wrap'
                }}>
                  {shoutout.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      style={{
                        backgroundColor: '#F3F4F6',
                        color: '#374151',
                        fontSize: '12px',
                        fontWeight: 500,
                        padding: '4px 12px',
                        borderRadius: '6px'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div style={{
                  display: 'flex',
                  gap: '24px',
                  paddingTop: '16px',
                  borderTop: '1px solid #F3F4F6'
                }}>
                  <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#6B7280',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#EF4444'}
                  onMouseLeave={(e) => e.target.style.color = '#6B7280'}
                  >
                    ❤️ {shoutout.likes}
                  </button>

                  <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#6B7280',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#4F46E5'}
                  onMouseLeave={(e) => e.target.style.color = '#6B7280'}
                  >
                    💬 {shoutout.comments}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
      `}</style>
    </div>
  );
}

export default Dashboard;