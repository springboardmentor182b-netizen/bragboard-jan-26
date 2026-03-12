import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, ShieldQuestion, ArrowRight, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [step, setStep] = useState(1); // 1: Email, 2: Security Question, 3: New Password
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const apiUrl = 'http://localhost:8000';
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await axios.post('http://127.0.0.1:8000/auth/forgot-password', { email });
            if (response.data.questions && response.data.questions.length > 0) {
                setQuestion(response.data.questions[0].question);
                setStep(2);
            } else {
                setError('No security questions found for this account.');
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'User not found');
        }
        setLoading(false);
    };

    const handleAnswerSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await axios.post(`${apiUrl}/verify-security-question`, { email, question, answer });
            setStep(3);
        } catch (err) {
            setError('Incorrect answer to security question.');
        }
        setLoading(false);
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (newPassword !== confirmPassword) return setError('Passwords do not match');

        setLoading(true);
        try {
            await axios.post(`${apiUrl}/reset-password`, {
                email,
                security_answer: answer,
                new_password: newPassword
            });
            setStep(4);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to reset password');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-brand-light-bg flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-brand-yellow to-brand-orange rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-orange-500/20">
                        <span className="text-3xl text-white">🔑</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
                    <p className="text-gray-500 mt-2">
                        {step === 1 && "Enter your email to find your account"}
                        {step === 2 && "Answer your security question"}
                        {step === 3 && "Create a new secure password"}
                        {step === 4 && "Password successfully reset!"}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm flex items-center justify-center">
                        {error}
                    </div>
                )}

                {step === 1 && (
                    <form onSubmit={handleEmailSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute left-3 top-3.5 text-gray-400"><Mail size={18} /></div>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none" placeholder="name@company.com" required />
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-brand-orange text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                            {loading ? 'Searching...' : 'Find Account'} <ArrowRight size={18} />
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleAnswerSubmit} className="space-y-4">
                        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mb-4">
                            <p className="text-sm font-semibold text-brand-orange">Security Question:</p>
                            <p className="text-gray-700">{question}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Your Answer</label>
                            <div className="relative">
                                <div className="absolute left-3 top-3.5 text-gray-400"><ShieldQuestion size={18} /></div>
                                <input value={answer} onChange={(e) => setAnswer(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none" placeholder="Enter your answer" required />
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-brand-orange text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                            {loading ? 'Verifying...' : 'Verify Answer'} <ArrowRight size={18} />
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleResetSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
                            <div className="relative">
                                <div className="absolute left-3 top-3.5 text-gray-400"><Lock size={18} /></div>
                                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none" placeholder="••••••••" required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm New Password</label>
                            <div className="relative">
                                <div className="absolute left-3 top-3.5 text-gray-400"><Lock size={18} /></div>
                                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none" placeholder="••••••••" required />
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-brand-orange text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                            {loading ? 'Resetting...' : 'Reset Password'} <ArrowRight size={18} />
                        </button>
                    </form>
                )}

                {step === 4 && (
                    <div className="text-center space-y-6">
                        <div className="flex justify-center text-green-500">
                            <CheckCircle size={64} />
                        </div>
                        <p className="text-gray-600">Your password has been reset successfully. You can now log in with your new password.</p>
                        <Link to="/login" className="block w-full bg-brand-orange text-white py-3 rounded-xl font-bold">
                            Go to Login
                        </Link>
                    </div>
                )}

                {step < 4 && (
                    <div className="text-center mt-6">
                        <Link to="/login" className="text-brand-orange font-bold hover:underline text-sm">Back to Login</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
