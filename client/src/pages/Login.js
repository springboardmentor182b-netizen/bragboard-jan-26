import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userType, setUserType] = useState('employee');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // For testing, accept any credentials
      if (email && password) {
        // Store user info in localStorage
        localStorage.setItem('access_token', 'mock_token_123');
        localStorage.setItem('user_id', '1');
        localStorage.setItem('role', userType === 'admin' ? 'admin' : 'user');
        localStorage.setItem('email', email);
        
        // Redirect to home page
        navigate('/');
      } else {
        setError('Please enter email and password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div style={{ 
      maxWidth: '450px', 
      margin: '50px auto', 
      padding: '40px',
      background: 'white',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>BragBoard</h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
        Welcome back! Sign in to your account
      </p>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={() => setUserType('employee')}
          style={{
            flex: 1,
            padding: '10px',
            background: userType === 'employee' ? '#3182ce' : '#f0f0f0',
            color: userType === 'employee' ? 'white' : '#333',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Employee Login
        </button>
        <button
          onClick={() => setUserType('admin')}
          style={{
            flex: 1,
            padding: '10px',
            background: userType === 'admin' ? '#3182ce' : '#f0f0f0',
            color: userType === 'admin' ? 'white' : '#333',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Admin Login
        </button>
      </div>
      
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>Email</label>
          <input
            type="email"
            placeholder="test@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '14px'
            }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '14px'
            }}
            required
          />
        </div>
        
        {error && <p style={{ color: 'red', fontSize: '14px', marginBottom: '15px' }}>{error}</p>}
        
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            background: '#3182ce',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Sign In
        </button>
      </form>
      
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Demo credentials: Any email/password works
        </p>
        <p style={{ color: '#666', fontSize: '14px', marginTop: '10px' }}>
          Don't have an account? <a href="/register" style={{ color: '#3182ce' }}>Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
