import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login({ email, password });
      const { access_token, user } = response.data;
      
      login(user, access_token);
      
      // Role-based redirect
      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6"
      style={{ 
        backgroundColor: '#F1F5F9'
      }}
    >
      <div className="w-full" style={{ maxWidth: '420px' }}>
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div 
            className="inline-flex items-center justify-center mb-4"
            style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.15)'
            }}
          >
            <span className="text-2xl">🎉</span>
          </div>
          <h1 className="text-3xl font-bold mb-1" style={{ color: '#4F46E5', fontWeight: 800 }}>
            BragBoard
          </h1>
          <p className="text-sm" style={{ color: '#6B7280', fontWeight: 500 }}>
            Employee Recognition Platform
          </p>
        </div>

        {/* Login Card */}
        <div 
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '40px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}
        >
          <div style={{ marginBottom: '32px' }}>
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#1F2937', fontWeight: 700 }}>
              Sign In
            </h2>
            <p className="text-sm" style={{ color: '#9CA3AF', fontWeight: 400 }}>
              Welcome back! Please enter your details
            </p>
          </div>

          {error && (
            <div style={{ 
              marginBottom: '24px',
              padding: '12px 16px',
              backgroundColor: '#FEE2E2',
              border: '1px solid #FCA5A5',
              borderRadius: '8px',
              color: '#991B1B'
            }}>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div style={{ marginBottom: '24px' }}>
              <label 
                className="block mb-2" 
                style={{ 
                  color: '#1F2937',
                  fontWeight: 600,
                  fontSize: '14px'
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 text-base outline-none"
                placeholder="your.email@company.com"
                style={{ 
                  height: '44px',
                  backgroundColor: '#FAFBFC',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  color: '#1F2937',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#4F46E5';
                  e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
                  e.target.style.backgroundColor = '#FFFFFF';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E5E7EB';
                  e.target.style.boxShadow = 'none';
                  e.target.style.backgroundColor = '#FAFBFC';
                }}
              />
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '12px' }}>
              <label 
                className="block mb-2" 
                style={{ 
                  color: '#1F2937',
                  fontWeight: 600,
                  fontSize: '14px'
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 text-base outline-none"
                placeholder="Enter your password"
                style={{ 
                  height: '44px',
                  backgroundColor: '#FAFBFC',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  color: '#1F2937',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#4F46E5';
                  e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
                  e.target.style.backgroundColor = '#FFFFFF';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E5E7EB';
                  e.target.style.boxShadow = 'none';
                  e.target.style.backgroundColor = '#FAFBFC';
                }}
              />
            </div>

            {/* Forgot Password Link */}
            <div style={{ marginBottom: '24px' }} className="text-right">
              <Link 
                to="/forgot-password" 
                className="hover:underline"
                style={{ 
                  color: '#10B981',
                  fontSize: '13px',
                  fontWeight: 500,
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = '#059669'}
                onMouseLeave={(e) => e.target.style.color = '#10B981'}
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 text-white text-base cursor-pointer"
              style={{ 
                backgroundColor: loading ? '#9CA3AF' : '#4F46E5',
                height: '48px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 600,
                transition: 'all 0.3s ease',
                boxShadow: loading ? 'none' : '0 2px 4px rgba(79, 70, 229, 0.2)'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = '#4338CA';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = '#4F46E5';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 4px rgba(79, 70, 229, 0.2)';
                }
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div 
            style={{ 
              margin: '28px 0',
              height: '1px',
              backgroundColor: '#E5E7EB'
            }}
          ></div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm" style={{ color: '#6B7280', fontWeight: 400 }}>
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="hover:underline"
                style={{ 
                  color: '#10B981',
                  fontSize: '13px',
                  fontWeight: 600,
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = '#059669'}
                onMouseLeave={(e) => e.target.style.color = '#10B981'}
              >
                Create one now →
              </Link>
            </p>
          </div>
        </div>

        {/* Security Badge */}
        <p 
          className="text-center text-xs mt-6" 
          style={{ color: '#10B981', fontWeight: 500 }}
        >
           {/*Secure authentication powered by JWT*/}
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        ::placeholder {
          color: #9CA3AF;
        }
      `}</style>
    </div>
  );
}

export default Login;