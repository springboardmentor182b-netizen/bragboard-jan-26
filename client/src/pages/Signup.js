import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Calendar, Briefcase, Building, ShieldQuestion, ArrowRight } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        full_name: '',
        password: '',
        confirmPassword: '',
        dob: '',
        work: '',
        company_name: '',
        phone_number: '',
        department: 'Engineering',
        job_title: '',
        security_question: 'What is your mother\'s maiden name?',
        security_answer: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);

        const userData = {
            username: formData.username,
            email: formData.email,
            full_name: formData.full_name,
            password: formData.password,
            dob: formData.dob,
            work: formData.work,
            company_name: formData.company_name,
            phone_number: formData.phone_number,
            job_title: formData.job_title,
            department: formData.department,
            security_questions: [
                {
                    question: formData.security_question,
                    answer: formData.security_answer
                }
            ]
        };

        const result = await signup(userData);
        if (result.success) {
            navigate('/login', { state: { message: 'Account created successfully! Please login.' } });
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-brand-light-bg flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl border border-gray-100">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-brand-yellow to-brand-orange rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-orange-500/20">
                        <span className="text-3xl text-white">🏆</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
                    <p className="text-gray-500 mt-2">Join BragBoard today</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm flex items-center justify-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
                            <div className="relative">
                                <div className="absolute left-3 top-3.5 text-gray-400"><User size={18} /></div>
                                <input name="username" value={formData.username} onChange={handleChange} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-orange outline-none" placeholder="johndoe" required />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                            <div className="relative">
                                <div className="absolute left-3 top-3.5 text-gray-400"><User size={18} /></div>
                                <input name="full_name" value={formData.full_name} onChange={handleChange} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-orange outline-none" placeholder="John Doe" required />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                            <div className="relative">
                                <div className="absolute left-3 top-3.5 text-gray-400"><Mail size={18} /></div>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-orange outline-none" placeholder="name@company.com" required />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <div className="absolute left-3 top-3.5 text-gray-400"><Lock size={18} /></div>
                                <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-orange outline-none" placeholder="••••••••" required />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute left-3 top-3.5 text-gray-400"><Lock size={18} /></div>
                                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-orange outline-none" placeholder="••••••••" required />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
                            <div className="relative">
                                <div className="absolute left-3 top-3.5 text-gray-400"><Calendar size={18} /></div>
                                <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-orange outline-none" required />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Work / Job Role</label>
                            <div className="relative">
                                <div className="absolute left-3 top-3.5 text-gray-400"><Briefcase size={18} /></div>
                                <input name="work" value={formData.work} onChange={handleChange} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-orange outline-none" placeholder="Software Engineer" required />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Company Name</label>
                            <div className="relative">
                                <div className="absolute left-3 top-3.5 text-gray-400"><Building size={18} /></div>
                                <input name="company_name" value={formData.company_name} onChange={handleChange} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-orange outline-none" placeholder="Tech Corp" required />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                            <div className="relative">
                                <div className="absolute left-3 top-3.5 text-gray-400"><Briefcase size={18} /></div>
                                <input name="phone_number" value={formData.phone_number} onChange={handleChange} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-orange outline-none" placeholder="+1 234 567 890" required />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Job Title</label>
                            <div className="relative">
                                <div className="absolute left-3 top-3.5 text-gray-400"><Briefcase size={18} /></div>
                                <input name="job_title" value={formData.job_title} onChange={handleChange} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-orange outline-none" placeholder="Software Engineer" required />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Department</label>
                            <div className="relative">
                                <div className="absolute left-3 top-3.5 text-gray-400"><Building size={18} /></div>
                                <select name="department" value={formData.department} onChange={handleChange} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-orange outline-none appearance-none">
                                    <option value="Engineering">Engineering</option>
                                    <option value="Design">Design</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Sales">Sales</option>
                                    <option value="HR">HR</option>
                                    <option value="IT">IT</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Operations">Operations</option>
                                    <option value="General">General</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Security Question</label>
                            <div className="relative">
                                <div className="absolute left-3 top-3.5 text-gray-400"><ShieldQuestion size={18} /></div>
                                <select name="security_question" value={formData.security_question} onChange={handleChange} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-orange outline-none appearance-none">
                                    <option>What is your mother's maiden name?</option>
                                    <option>What was the name of your first pet?</option>
                                    <option>What city were you born in?</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Security Answer</label>
                            <div className="relative">
                                <div className="absolute left-3 top-3.5 text-gray-400"><Lock size={18} /></div>
                                <input name="security_answer" value={formData.security_answer} onChange={handleChange} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-orange outline-none" placeholder="Your answer" required />
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 pt-4">
                        <button type="submit" disabled={loading} className="w-full bg-brand-orange text-white py-3 rounded-xl font-bold hover:bg-brand-dark transition-colors shadow-lg shadow-brand-orange/20 flex items-center justify-center gap-2">
                            {loading ? 'Creating Account...' : 'Create Account'}
                            {!loading && <ArrowRight size={18} />}
                        </button>
                        <p className="text-center text-gray-500 mt-4 text-sm">
                            Already have an account? <Link to="/login" className="text-brand-orange font-bold hover:underline">Sign In</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
