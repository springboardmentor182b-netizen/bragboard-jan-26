import React, { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff, Github } from 'lucide-react';

function Login({ onLoginSuccess }) {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    department: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        await axios.post('http://localhost:8000/auth/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          department: formData.department
        });
        
        const loginResponse = await axios.post('http://localhost:8000/auth/token', 
          new URLSearchParams({
            username: formData.email,
            password: formData.password
          }),
          {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          }
        );
        
        localStorage.setItem('access_token', loginResponse.data.access_token);
        onLoginSuccess();
      } else {
        const response = await axios.post('http://localhost:8000/auth/token',
          new URLSearchParams({
            username: formData.email,
            password: formData.password
          }),
          {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          }
        );
        
        localStorage.setItem('access_token', response.data.access_token);
        onLoginSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // TODO: Implement Google OAuth
    alert('Google Sign-In will be implemented with OAuth 2.0');
  };

  const handleGithubSignIn = () => {
    // TODO: Implement GitHub OAuth
    alert('GitHub Sign-In will be implemented with OAuth 2.0');
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="bg-secondary rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            🎉 BragBoard
          </h1>
          <p className="text-accent1 text-lg">
            {isSignup ? 'Create your account' : 'Welcome back!'}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* OAuth Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-accent1 rounded-lg hover:bg-accent1 hover:text-secondary transition-all duration-200 text-primary font-medium"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <button
            onClick={handleGithubSignIn}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-accent1 rounded-lg hover:bg-accent1 hover:text-secondary transition-all duration-200 text-primary font-medium"
          >
            <Github className="w-5 h-5" />
            Continue with GitHub
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-accent2"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-secondary text-accent1">Or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-accent2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent1 bg-white"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-accent2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent1 bg-white"
                  placeholder="Engineering"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-accent2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent1 bg-white"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 pr-12 border-2 border-accent2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent1 bg-white"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-accent1 hover:text-primary"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-secondary py-3 px-4 rounded-lg hover:bg-accent1 focus:outline-none focus:ring-2 focus:ring-accent1 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg"
          >
            {loading ? 'Please wait...' : (isSignup ? 'Sign Up' : 'Log In')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setError('');
            }}
            className="text-accent1 hover:text-primary text-sm font-medium"
          >
            {isSignup 
              ? 'Already have an account? Log in' 
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;