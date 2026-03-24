import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

function ForgotPassword() {
  const [step, setStep] = useState(1); // 1 = email, 2 = security question
  const [email, setEmail] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();

  // Step 1: Submit email to get security question
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.forgotPassword(email);
      setSecurityQuestion(response.data.security_question);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to retrieve security question.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Submit answer and new password
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authAPI.resetPassword({
        email: email,
        security_answer: securityAnswer,
        new_password: newPassword
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to reset password. Please check your answer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: '#F1F5F9' }}
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

        {/* Reset Card */}
        <div 
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}
        >
          <div style={{ marginBottom: '32px' }}>
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#1F2937', fontWeight: 700 }}>
              Reset Password
            </h2>
            <p className="text-sm" style={{ color: '#9CA3AF', fontWeight: 400 }}>
              {step === 1 ? 'Enter your email to get started' : 'Answer your security question'}
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

          {success && (
            <div style={{ 
              marginBottom: '24px',
              padding: '12px 16px',
              backgroundColor: '#D1FAE5',
              border: '1px solid #10B981',
              borderRadius: '8px',
              color: '#065F46'
            }}>
              <p className="text-sm" style={{ fontWeight: 500 }}>
                ✓ Password reset successfully! Redirecting to login...
              </p>
            </div>
          )}

          {/* Step 1: Email Form */}
          {step === 1 && (
            <form onSubmit={handleEmailSubmit}>
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
                {loading ? 'Checking...' : 'Continue'}
              </button>
            </form>
          )}

          {/* Step 2: Security Question Form */}
          {step === 2 && !success && (
            <form onSubmit={handleResetSubmit}>
              {/* Display Security Question */}
              <div style={{ 
                marginBottom: '24px',
                padding: '16px',
                backgroundColor: '#EEF2FF',
                borderRadius: '8px',
                border: '1px solid #C7D2FE'
              }}>
                <p className="text-sm" style={{ color: '#4F46E5', fontWeight: 600, marginBottom: '4px' }}>
                  Security Question:
                </p>
                <p style={{ color: '#1F2937', fontWeight: 500 }}>
                  {securityQuestion}
                </p>
              </div>

              {/* Security Answer */}
              <div style={{ marginBottom: '20px' }}>
                <label 
                  className="block mb-2" 
                  style={{ 
                    color: '#1F2937',
                    fontWeight: 600,
                    fontSize: '14px'
                  }}
                >
                  Your Answer
                </label>
                <input
                  type="text"
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  required
                  className="w-full px-4 py-3 text-base outline-none"
                  placeholder="Enter your answer"
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

              {/* New Password */}
              <div style={{ marginBottom: '24px' }}>
                <label 
                  className="block mb-2" 
                  style={{ 
                    color: '#1F2937',
                    fontWeight: 600,
                    fontSize: '14px'
                  }}
                >
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength="6"
                  className="w-full px-4 py-3 text-base outline-none"
                  placeholder="At least 6 characters"
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

              <button
                type="submit"
                disabled={loading || success}
                className="w-full py-3 px-6 text-white text-base cursor-pointer"
                style={{ 
                  backgroundColor: loading || success ? '#9CA3AF' : '#4F46E5',
                  height: '48px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  boxShadow: loading || success ? 'none' : '0 2px 4px rgba(79, 70, 229, 0.2)'
                }}
                onMouseEnter={(e) => {
                  if (!loading && !success) {
                    e.target.style.backgroundColor = '#4338CA';
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading && !success) {
                    e.target.style.backgroundColor = '#4F46E5';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 4px rgba(79, 70, 229, 0.2)';
                  }
                }}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}

          {/* Divider */}
          <div 
            style={{ 
              margin: '28px 0',
              height: '1px',
              backgroundColor: '#E5E7EB'
            }}
          ></div>

          {/* Back to Login Link */}
          <div className="text-center">
            <p className="text-sm" style={{ color: '#6B7280', fontWeight: 400 }}>
              Remember your password?{' '}
              <Link 
                to="/login" 
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
                Back to login →
              </Link>
            </p>
          </div>
        </div>
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

export default ForgotPassword;
