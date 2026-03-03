import { useState, useEffect } from 'react';

export default function Settings() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('http://localhost:8000/users/me')
            .then(res => res.json())
            .then(data => {
                setUser(data);
                setLoading(false);
            })
            .catch(err => console.error('Error fetching profile:', err));
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
            const response = await fetch('http://localhost:8000/users/me', {
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

    if (loading) return <div className="p-20 text-center animate-pulse text-gray-400">Loading your profile...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <div className="flex items-end justify-between">
                <div>
                    <h2 className="text-4xl font-black text-gray-900">Settings</h2>
                    <p className="text-gray-500 mt-2 text-lg">Manage your account preferences and notifications.</p>
                </div>
                {message && (
                    <div className="bg-orange-100 text-orange-700 px-6 py-3 rounded-2xl font-bold text-sm animate-bounce">
                        {message}
                    </div>
                )}
            </div>

            {/* Account Info Card */}
            <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100 flex flex-col items-center">
                <div className="flex items-center gap-2 self-start mb-8 text-orange-500 font-black uppercase tracking-widest text-xs">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Account Information
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                    <div className="space-y-2">
                        <label className="text-sm font-black text-gray-700 ml-2">Full Name</label>
                        <input
                            type="text"
                            name="full_name"
                            value={user.full_name || ''}
                            onChange={handleChange}
                            placeholder="Your name"
                            className="w-full bg-slate-50 border-none rounded-2xl p-4 text-gray-900 font-bold focus:ring-2 focus:ring-orange-500/20 transition-all outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-black text-gray-700 ml-2">Job Title</label>
                        <input
                            type="text"
                            name="job_title"
                            value={user.job_title || ''}
                            onChange={handleChange}
                            placeholder="Your role"
                            className="w-full bg-slate-50 border-none rounded-2xl p-4 text-gray-900 font-bold focus:ring-2 focus:ring-orange-500/20 transition-all outline-none"
                        />
                    </div>
                    <div className="col-span-full space-y-2">
                        <label className="text-sm font-black text-gray-700 ml-2">Email Address</label>
                        <input
                            type="email"
                            value={user.email}
                            readOnly
                            className="w-full bg-slate-50 border-none rounded-2xl p-4 text-gray-400 font-bold cursor-not-allowed opacity-70"
                        />
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="mt-10 px-10 py-4 bg-gray-900 text-white font-black rounded-3xl hover:bg-orange-600 transition-all hover:scale-105 active:scale-95 self-end disabled:opacity-50"
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {/* Notifications Card */}
            <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-8 text-orange-500 font-black uppercase tracking-widest text-xs">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    Notifications
                </div>

                <div className="space-y-8">
                    {[
                        { id: 'email_notifications', title: 'Email Notifications', desc: 'Receive daily summaries of shout-outs' },
                        { id: 'shoutout_alerts', title: 'New Shout-out Alerts', desc: 'Get notified when someone tags you' },
                        { id: 'marketing_emails', title: 'Marketing Emails', desc: 'Receive tips and company news' }
                    ].map((item) => (
                        <div key={item.id} className="flex items-center justify-between group">
                            <div>
                                <h4 className="font-bold text-gray-900">{item.title}</h4>
                                <p className="text-xs text-gray-400 font-medium group-hover:text-gray-500 transition-colors">{item.desc}</p>
                            </div>
                            <button
                                onClick={() => toggleNotification(item.id)}
                                className={`w-14 h-8 rounded-full transition-colors relative ${user[item.id] ? 'bg-orange-500' : 'bg-gray-200'}`}
                            >
                                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${user[item.id] ? 'right-1' : 'left-1'}`} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
