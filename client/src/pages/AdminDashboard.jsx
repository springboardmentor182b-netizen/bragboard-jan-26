import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Ensure only admins can access this page
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard');  // Redirect non-admins to employee dashboard
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Mock admin statistics
  const stats = {
    totalEmployees: 47,
    totalShoutouts: 234,
    thisWeek: 18,
    topContributor: 'Sarah Johnson (12 shoutouts)',
    mostTagged: 'Mike Chen (15 times)'
  };

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
              background: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '18px'
            }}>
              A
            </div>
            <div>
              <h1 style={{ 
                fontSize: '20px',
                fontWeight: 700,
                color: '#1F2937',
                margin: 0,
                lineHeight: 1.2
              }}>
                Admin Dashboard
              </h1>
              <p style={{ 
                fontSize: '12px',
                color: '#6B7280',
                fontWeight: 400,
                margin: 0
              }}>
                BragBoard Management
              </p>
            </div>
          </div>

          {/* Right: User Profile & Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                background: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '14px'
              }}>
                {user?.name?.split(' ').map(n => n[0]).join('') || 'A'}
              </div>
              <div>
                <div style={{ 
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#1F2937'
                }}>
                  {user?.name || 'Admin'}
                </div>
                <div style={{ 
                  fontSize: '12px',
                  color: '#DC2626',
                  fontWeight: 600
                }}>
                  👑 Administrator
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
        {/* Welcome Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #DC2626 0%, #F59E0B 100%)',
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
            Welcome back, {user?.name?.split(' ')[0] || 'Admin'}! 👋
          </h2>
          <p style={{ 
            fontSize: '16px',
            fontWeight: 400,
            margin: 0,
            opacity: 0.9
          }}>
            Manage your team's recognition and engagement
          </p>
        </div>

        {/* Statistics Grid */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          {/* Total Employees Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{ 
              fontSize: '14px',
              color: '#6B7280',
              fontWeight: 500,
              marginBottom: '8px'
            }}>
              Total Employees
            </div>
            <div style={{ 
              fontSize: '32px',
              fontWeight: 700,
              color: '#1F2937'
            }}>
              {stats.totalEmployees}
            </div>
            <div style={{ 
              fontSize: '13px',
              color: '#10B981',
              fontWeight: 500,
              marginTop: '8px'
            }}>
              ↑ 5% from last month
            </div>
          </div>

          {/* Total Shoutouts Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{ 
              fontSize: '14px',
              color: '#6B7280',
              fontWeight: 500,
              marginBottom: '8px'
            }}>
              Total Shoutouts
            </div>
            <div style={{ 
              fontSize: '32px',
              fontWeight: 700,
              color: '#1F2937'
            }}>
              {stats.totalShoutouts}
            </div>
            <div style={{ 
              fontSize: '13px',
              color: '#10B981',
              fontWeight: 500,
              marginTop: '8px'
            }}>
              {stats.thisWeek} this week
            </div>
          </div>

          {/* Top Contributor Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{ 
              fontSize: '14px',
              color: '#6B7280',
              fontWeight: 500,
              marginBottom: '8px'
            }}>
              Top Contributor
            </div>
            <div style={{ 
              fontSize: '18px',
              fontWeight: 600,
              color: '#1F2937',
              marginTop: '8px'
            }}>
              {stats.topContributor}
            </div>
            <div style={{ 
              fontSize: '13px',
              color: '#F59E0B',
              fontWeight: 500,
              marginTop: '8px'
            }}>
              ⭐ Most active
            </div>
          </div>

          {/* Most Tagged Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{ 
              fontSize: '14px',
              color: '#6B7280',
              fontWeight: 500,
              marginBottom: '8px'
            }}>
              Most Appreciated
            </div>
            <div style={{ 
              fontSize: '18px',
              fontWeight: 600,
              color: '#1F2937',
              marginTop: '8px'
            }}>
              {stats.mostTagged}
            </div>
            <div style={{ 
              fontSize: '13px',
              color: '#8B5CF6',
              fontWeight: 500,
              marginTop: '8px'
            }}>
              💜 Team favorite
            </div>
          </div>
        </div>

        {/* Admin Actions Section */}
        <div>
          <h3 style={{ 
            fontSize: '24px',
            fontWeight: 700,
            color: '#1F2937',
            margin: '0 0 20px 0'
          }}>
            Quick Actions
          </h3>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px'
          }}>
            {/* View All Users */}
            <button style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#4F46E5';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#E5E7EB';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>👥</div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: '#1F2937', marginBottom: '4px' }}>
                Manage Users
              </div>
              <div style={{ fontSize: '14px', color: '#6B7280' }}>
                View, edit, or remove users
              </div>
            </button>

            {/* View Reports */}
            <button style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#DC2626';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#E5E7EB';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🚨</div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: '#1F2937', marginBottom: '4px' }}>
                View Reports
              </div>
              <div style={{ fontSize: '14px', color: '#6B7280' }}>
                Review flagged content
              </div>
            </button>

            {/* Analytics */}
            <button style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#10B981';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#E5E7EB';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>📊</div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: '#1F2937', marginBottom: '4px' }}>
                Analytics
              </div>
              <div style={{ fontSize: '14px', color: '#6B7280' }}>
                View engagement metrics
              </div>
            </button>
          </div>
        </div>

        {/* Information Notice */}
        <div style={{
          marginTop: '32px',
          backgroundColor: '#EEF2FF',
          border: '1px solid #C7D2FE',
          borderRadius: '12px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'start',
          gap: '12px'
        }}>
          <div style={{ fontSize: '20px' }}>ℹ️</div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#4F46E5', marginBottom: '4px' }}>
              Admin Features Coming Soon
            </div>
            <div style={{ fontSize: '13px', color: '#6B7280' }}>
              Full user management, analytics, and moderation tools will be available in Milestone 4 (Weeks 7-8).
              Currently displaying mock data for UI demonstration.
            </div>
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

export default AdminDashboard;
