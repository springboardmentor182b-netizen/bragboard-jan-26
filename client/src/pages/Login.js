import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // Mock login - accept any credentials
      if (email && password) {
        const mockUser = {
          id: 1,
          username: email.split('@')[0],
          email: email,
          role: email.includes('admin') ? 'admin' : 'user'
        };
        localStorage.setItem('access_token', 'mock_token_123');
        localStorage.setItem('user', JSON.stringify(mockUser));
        if (login) login(mockUser);
        navigate('/dashboard');
      } else {
        setError('Please enter email and password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Login to BragBoard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '10px', margin: '10px 0' }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '10px', margin: '10px 0' }}
          required
        />
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#213555', color: 'white' }}>
          Login
        </button>
      </form>
      <p>
        <Link to="/forgot-password">Forgot Password?</Link> | <Link to="/signup">Sign Up</Link>
      </p>
      <p style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        Demo: Any email/password works
      </p>
    </div>
  );
};

export default Login;
