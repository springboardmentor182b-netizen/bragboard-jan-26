import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    security_question: '',
    security_answer: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);  // ✅ show success screen
  const [registeredName, setRegisteredName] = useState('');

  const navigate = useNavigate();

  const securityQuestions = [
    "What is your first pet's name?",
    "What is your mother's maiden name?",
    "What city were you born in?",
    "What is your favorite book?",
    "What was the name of your first school?"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authAPI.register(formData);
      // ✅ Show the "pending approval" success screen instead of immediately redirecting
      setRegisteredName(formData.name.split(' ')[0]);
      setRegistered(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ─── ✅ Success screen — replaces old "redirecting to login" toast ─────────
  // Shows after registration to clearly explain the admin approval step.
  if (registered) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{ backgroundColor: '#F1F5F9' }}
      >
        <div className="w-full" style={{ maxWidth: '480px' }}>
          {/* Logo */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center mb-4"
              style={{
                width: '48px', height: '48px',
                background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
                borderRadius: '8px', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.15)'
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

          {/* Success card */}
          <div style={{
            backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '40px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)', textAlign: 'center'
          }}>
            {/* Big checkmark */}
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #10B981, #059669)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px', boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)'
            }}>
              <span style={{ fontSize: '32px' }}>✓</span>
            </div>

            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', margin: '0 0 8px 0' }}>
              You're registered, {registeredName}!
            </h2>
            <p style={{ fontSize: '15px', color: '#6B7280', margin: '0 0 28px 0', lineHeight: 1.6 }}>
              Your account is <strong style={{ color: '#D97706' }}>pending admin approval</strong>.<br/>
              You'll be able to log in once an administrator reviews and approves your account.
            </p>

            {/* What happens next steps */}
            <div style={{
              background: '#F9FAFB', borderRadius: '12px',
              padding: '20px', marginBottom: '28px', textAlign: 'left'
            }}>
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 14px 0' }}>
                What happens next
              </p>
              {[
                { icon: '📬', text: 'Your registration is now in the admin queue' },
                { icon: '👀', text: 'An admin will review your account' },
                { icon: '✅', text: 'Once approved, you can sign in and start recognising colleagues' },
              ].map((step, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  marginBottom: i < 2 ? '12px' : 0
                }}>
                  <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '1px' }}>{step.icon}</span>
                  <p style={{ fontSize: '13px', color: '#374151', margin: 0, lineHeight: 1.5 }}>{step.text}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={() => navigate('/login')}
              style={{
                width: '100%', height: '48px', borderRadius: '8px', border: 'none',
                background: '#4F46E5', color: '#fff', fontSize: '15px', fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)'
              }}
              onMouseEnter={e => { e.target.style.background = '#4338CA'; e.target.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.target.style.background = '#4F46E5'; e.target.style.transform = 'translateY(0)'; }}
            >
              Back to Sign In
            </button>
          </div>
        </div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
        `}</style>
      </div>
    );
  }

  // ─── Registration form (unchanged) ───────────────────────────────────────
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
              width: '48px', height: '48px',
              background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
              borderRadius: '8px', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.15)'
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

        {/* Register Card */}
        <div style={{
          backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '40px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{ marginBottom: '32px' }}>
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#1F2937', fontWeight: 700 }}>
              Create Account
            </h2>
            <p className="text-sm" style={{ color: '#9CA3AF', fontWeight: 400 }}>
              Join your team on BragBoard today
            </p>
          </div>

          {/* ✅ Note about approval requirement */}
          <div style={{
            marginBottom: '20px', padding: '12px 14px',
            background: '#EEF2FF', border: '1px solid #C7D2FE',
            borderRadius: '8px', display: 'flex', alignItems: 'flex-start', gap: '10px'
          }}>
            <span style={{ fontSize: '16px', flexShrink: 0 }}>ℹ️</span>
            <p style={{ fontSize: '12px', color: '#4338CA', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
              After registering, your account will require <strong>admin approval</strong> before you can log in.
            </p>
          </div>

          {error && (
            <div style={{
              marginBottom: '24px', padding: '12px 16px',
              backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5',
              borderRadius: '8px', color: '#991B1B'
            }}>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div style={{ marginBottom: '20px' }}>
              <label className="block mb-2" style={{ color: '#1F2937', fontWeight: 600, fontSize: '14px' }}>
                Full Name
              </label>
              <input
                type="text" name="name" value={formData.name}
                onChange={handleChange} required minLength="2"
                className="w-full px-4 py-3 text-base outline-none"
                placeholder="John Doe"
                style={{ height: '44px', backgroundColor: '#FAFBFC', border: '1px solid #E5E7EB', borderRadius: '8px', color: '#1F2937', transition: 'all 0.2s ease' }}
                onFocus={e => { e.target.style.borderColor = '#4F46E5'; e.target.style.boxShadow = '0 0 0 3px rgba(79,70,229,0.1)'; e.target.style.backgroundColor = '#FFFFFF'; }}
                onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; e.target.style.backgroundColor = '#FAFBFC'; }}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: '20px' }}>
              <label className="block mb-2" style={{ color: '#1F2937', fontWeight: 600, fontSize: '14px' }}>
                Email Address
              </label>
              <input
                type="email" name="email" value={formData.email}
                onChange={handleChange} required
                className="w-full px-4 py-3 text-base outline-none"
                placeholder="your.email@company.com"
                style={{ height: '44px', backgroundColor: '#FAFBFC', border: '1px solid #E5E7EB', borderRadius: '8px', color: '#1F2937', transition: 'all 0.2s ease' }}
                onFocus={e => { e.target.style.borderColor = '#4F46E5'; e.target.style.boxShadow = '0 0 0 3px rgba(79,70,229,0.1)'; e.target.style.backgroundColor = '#FFFFFF'; }}
                onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; e.target.style.backgroundColor = '#FAFBFC'; }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '20px' }}>
              <label className="block mb-2" style={{ color: '#1F2937', fontWeight: 600, fontSize: '14px' }}>
                Password
              </label>
              <input
                type="password" name="password" value={formData.password}
                onChange={handleChange} required minLength="6"
                className="w-full px-4 py-3 text-base outline-none"
                placeholder="At least 8 characters"
                style={{ height: '44px', backgroundColor: '#FAFBFC', border: '1px solid #E5E7EB', borderRadius: '8px', color: '#1F2937', transition: 'all 0.2s ease' }}
                onFocus={e => { e.target.style.borderColor = '#4F46E5'; e.target.style.boxShadow = '0 0 0 3px rgba(79,70,229,0.1)'; e.target.style.backgroundColor = '#FFFFFF'; }}
                onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; e.target.style.backgroundColor = '#FAFBFC'; }}
              />
            </div>

            {/* Department */}
            <div style={{ marginBottom: '20px' }}>
              <label className="block mb-2" style={{ color: '#1F2937', fontWeight: 600, fontSize: '14px' }}>
                Department
              </label>
              <input
                type="text" name="department" value={formData.department}
                onChange={handleChange} required
                className="w-full px-4 py-3 text-base outline-none"
                placeholder="e.g. Engineering, Marketing"
                style={{ height: '44px', backgroundColor: '#FAFBFC', border: '1px solid #E5E7EB', borderRadius: '8px', color: '#1F2937', transition: 'all 0.2s ease' }}
                onFocus={e => { e.target.style.borderColor = '#4F46E5'; e.target.style.boxShadow = '0 0 0 3px rgba(79,70,229,0.1)'; e.target.style.backgroundColor = '#FFFFFF'; }}
                onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; e.target.style.backgroundColor = '#FAFBFC'; }}
              />
            </div>

            {/* Security Question */}
            <div style={{ marginBottom: '20px' }}>
              <label className="block mb-2" style={{ color: '#1F2937', fontWeight: 600, fontSize: '14px' }}>
                Security Question
              </label>
              <select
                name="security_question" value={formData.security_question}
                onChange={handleChange} required
                className="w-full px-4 py-3 text-base outline-none"
                style={{
                  height: '44px', backgroundColor: '#FAFBFC', border: '1px solid #E5E7EB',
                  borderRadius: '8px', color: formData.security_question ? '#1F2937' : '#9CA3AF',
                  transition: 'all 0.2s ease', cursor: 'pointer'
                }}
                onFocus={e => { e.target.style.borderColor = '#4F46E5'; e.target.style.boxShadow = '0 0 0 3px rgba(79,70,229,0.1)'; e.target.style.backgroundColor = '#FFFFFF'; }}
                onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; e.target.style.backgroundColor = '#FAFBFC'; }}
              >
                <option value="">Select a security question</option>
                {securityQuestions.map((q, i) => (
                  <option key={i} value={q}>{q}</option>
                ))}
              </select>
            </div>

            {/* Security Answer */}
            <div style={{ marginBottom: '24px' }}>
              <label className="block mb-2" style={{ color: '#1F2937', fontWeight: 600, fontSize: '14px' }}>
                Security Answer
              </label>
              <input
                type="text" name="security_answer" value={formData.security_answer}
                onChange={handleChange} required minLength="2"
                className="w-full px-4 py-3 text-base outline-none"
                placeholder="Your answer (used for password recovery)"
                style={{ height: '44px', backgroundColor: '#FAFBFC', border: '1px solid #E5E7EB', borderRadius: '8px', color: '#1F2937', transition: 'all 0.2s ease' }}
                onFocus={e => { e.target.style.borderColor = '#4F46E5'; e.target.style.boxShadow = '0 0 0 3px rgba(79,70,229,0.1)'; e.target.style.backgroundColor = '#FFFFFF'; }}
                onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; e.target.style.backgroundColor = '#FAFBFC'; }}
              />
              <p className="text-xs mt-2" style={{ color: '#6B7280' }}>
                💡 Remember this — you'll need it if you forget your password
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              className="w-full py-3 px-6 text-white text-base cursor-pointer"
              style={{
                backgroundColor: loading ? '#9CA3AF' : '#4F46E5',
                height: '48px', borderRadius: '8px', border: 'none', fontWeight: 600,
                transition: 'all 0.3s ease',
                boxShadow: loading ? 'none' : '0 2px 4px rgba(79,70,229,0.2)'
              }}
              onMouseEnter={e => { if (!loading) { e.target.style.backgroundColor = '#4338CA'; e.target.style.transform = 'translateY(-1px)'; } }}
              onMouseLeave={e => { if (!loading) { e.target.style.backgroundColor = '#4F46E5'; e.target.style.transform = 'translateY(0)'; } }}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div style={{ margin: '28px 0', height: '1px', backgroundColor: '#E5E7EB' }}></div>

          <div className="text-center">
            <p className="text-sm" style={{ color: '#6B7280', fontWeight: 400 }}>
              Already have an account?{' '}
              <Link
                to="/login"
                className="hover:underline"
                style={{ color: '#10B981', fontSize: '13px', fontWeight: 600, transition: 'color 0.2s ease' }}
                onMouseEnter={e => e.target.style.color = '#059669'}
                onMouseLeave={e => e.target.style.color = '#10B981'}
              >
                Sign in here →
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
        ::placeholder { color: #9CA3AF; }
      `}</style>
    </div>
  );
}

export default Register;