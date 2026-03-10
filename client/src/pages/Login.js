import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
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

        const result = await login(email, password);
        if (result.success) {
            navigate('/dashboard/feed');
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    const message = useNavigate().state?.message;

    return (
        <div className="min-h-screen bg-brand-light-bg flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-brand-yellow to-brand-orange rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-orange-500/20">
                        <span className="text-3xl text-white">🏆</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
                    <p className="text-gray-500 mt-2">Sign in to your BragBoard account</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm flex items-center justify-center">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-6 text-sm flex items-center justify-center">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                            <div className="absolute left-3 top-3.5 text-gray-400">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all"
                                placeholder="name@company.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <div className="absolute left-3 top-3.5 text-gray-400">
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-orange text-white py-3 rounded-xl font-bold hover:bg-brand-dark transition-colors shadow-lg shadow-brand-orange/20 flex items-center justify-center gap-2 mt-4"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                        {!loading && <ArrowRight size={18} />}
                    </button>

                    <div className="flex flex-col items-center gap-2 mt-4">
                        <Link to="/forgot-password" title='forgot password' className="text-sm text-brand-orange font-semibold hover:underline">Forgot Password?</Link>
                        <p className="text-sm text-gray-500">
                            Don't have an account? <Link to="/signup" title='signup' className="text-brand-orange font-bold hover:underline">Create Account</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
