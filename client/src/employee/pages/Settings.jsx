import { useState, useEffect } from 'react';

export default function Settings() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const url = `${process.env.REACT_APP_API_URL}/users/me`;
        console.log('Fetching from:', url);
        fetch(url)
            .then(res => {
                console.log('Response status:', res.status);
                if (!res.ok) throw new Error('Not ok');
                return res.json();
            })
            .then(data => {
                console.log('User data:', data);
                setUser(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching profile:', err);
                setLoading(false); // Stop loading even on error to show something
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const toggleNotification = (key) => {
        setUser(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage('');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/me`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: user.full_name,
                    job_title: user.job_title,
                    email_notifications: user.email_notifications,
                    shoutout_alerts: user.shoutout_alerts,
                    marketing_emails: user.marketing_emails
                })
            });
            if (response.ok) {
                setMessage('Settings updated successfully! ✨');
                window.dispatchEvent(new Event('profileUpdated'));
            } else {

                setMessage('Failed to update settings. Please try again.');
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            setMessage('Network error. Check your connection.');
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    if (loading) return <div className="p-20 text-center animate-pulse text-gray-400">Loading account settings...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <div className="flex items-end justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
                    <p className="text-gray-500 mt-2 text-base">Manage your account preferences and notifications.</p>
                </div>
                {message && (
                    <div className="bg-orange-100 text-orange-700 px-6 py-3 rounded-2xl font-bold text-sm animate-bounce">
                        {message}
                    </div>
                )}
            </div>

            {/* Account Info Card */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center">
                <div className="flex items-center gap-2 self-start mb-6 text-orange-500 font-bold text-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Account Information
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-800 ml-1">Full Name</label>
                        <input
                            type="text"
                            name="full_name"
                            value={user.full_name || ''}
                            onChange={handleChange}
                            placeholder="Your name"
                            className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:ring-2 focus:ring-orange-500/20 transition-all outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-800 ml-1">Job Title</label>
                        <input
                            type="text"
                            name="job_title"
                            value={user.job_title || ''}
                            onChange={handleChange}
                            placeholder="Your role"
                            className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:ring-2 focus:ring-orange-500/20 transition-all outline-none"
                        />
                    </div>
                    <div className="col-span-full space-y-2">
                        <label className="text-sm font-semibold text-gray-800 ml-1">Email Address</label>
                        <input
                            type="email"
                            value={user.email || ''}
                            readOnly
                            className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 text-gray-500 outline-none"
                        />
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="mt-8 px-6 py-2.5 bg-[#1C1C1C] text-white font-semibold rounded-xl hover:bg-black transition-all self-end disabled:opacity-50"
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {/* Notifications Card */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-8 text-orange-500 font-bold text-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    Notifications
                </div>

                <div className="space-y-6">
                    {[
                        { id: 'email_notifications', title: 'Email Notifications', desc: 'Receive daily summaries of shout-outs' },
                        { id: 'shoutout_alerts', title: 'New Shout-out Alerts', desc: 'Get notified when someone tags you' },
                        { id: 'marketing_emails', title: 'Marketing Emails', desc: 'Receive tips and company news' }
                    ].map((item) => (
                        <div key={item.id} className="flex items-center justify-between group">
                            <div>
                                <h4 className="font-semibold text-gray-900">{item.title}</h4>
                                <p className="text-sm text-gray-400 group-hover:text-gray-500 transition-colors">{item.desc}</p>
                            </div>
                            <button
                                onClick={() => toggleNotification(item.id)}
                                className={`w-11 h-6 rounded-full border-2 transition-colors relative flex items-center ${user[item.id] ? 'border-orange-500' : 'border-gray-200'}`}
                            >
                                <div className={`w-4 h-4 rounded-full border-2 transition-all absolute ${user[item.id] ? 'translate-x-[20px] border-orange-500' : 'translate-x-1 border-gray-200'}`} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
