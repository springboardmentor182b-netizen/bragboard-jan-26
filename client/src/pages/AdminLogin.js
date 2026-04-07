import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Mail, Lock } from 'lucide-react';
import './AdminLogin.css';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const result = await login(email, password);
        
        if (result.success) {
            // Retrieve user from localStorage to check role since AuthContext might take a tick to update state
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                if (user.role === 'admin') {
                    navigate('/admin');
                } else {
                    setError('Access denied. Administrator privileges required.');
                }
            } else {
                navigate('/admin');
            }
        } else {
            setError(result.message || 'Invalid credentials');
        }
        
        setIsLoading(false);
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-card">
                <div className="admin-login-header">
                    <div className="admin-login-logo">
                        <Shield className="admin-logo-icon" size={32} />
                    </div>
                    <h1>BragBoard Admin</h1>
                    <span className="admin-subtitle">ADMINISTRATIVE ACCESS</span>
                </div>

                <div className="admin-login-form-header">
                    <h2>Admin Portal</h2>
                    <p>Sign in with administrator credentials</p>
                </div>

                {error && <div className="admin-login-error">{error}</div>}

                <form onSubmit={handleSubmit} className="admin-login-form">
                    <div className="form-group">
                        <label>Admin Email</label>
                        <div className="input-with-icon">
                            <Mail className="input-icon" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@company.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-with-icon">
                            <Lock className="input-icon" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter admin password"
                                required
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="admin-submit-btn"
                        disabled={isLoading}
                    >
                        <Shield size={18} />
                        {isLoading ? 'Signing in...' : 'Sign In as Admin'}
                    </button>
                    
                    <div className="admin-login-footer">
                        <span>Not an admin? </span>
                        <Link to="/login" className="user-login-link">Go to User Login</Link>
                    </div>
                </form>
            </div>
            {/* Background elements */}
            <div className="bg-star star-1">☆</div>
            <div className="bg-star star-2">☆</div>
            <div className="bg-star star-3">☆</div>
        </div>
    );
};

export default AdminLogin;
