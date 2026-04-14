import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Password reset link sent to your email!');
    setEmail('');
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Forgot Password</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '10px', margin: '10px 0' }}
          required
        />
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#213555', color: 'white' }}>
          Send Reset Link
        </button>
      </form>
      <p><Link to="/login">Back to Login</Link></p>
    </div>
  );
};

export default ForgotPassword;
