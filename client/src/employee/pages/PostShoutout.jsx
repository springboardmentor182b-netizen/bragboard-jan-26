import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const VALUES = ['Teamwork', 'Innovation', 'Customer Love', 'Leadership', 'Design', 'Speed', 'Quality'];

export default function PostShoutout() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState('');
    const [selectedValues, setSelectedValues] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/users/`)
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(err => console.error('Error fetching users:', err));
    }, []);

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(search.toLowerCase()) &&
        (!selectedUser || u.id !== selectedUser.id)
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedUser || !message.trim()) return;

        setIsSubmitting(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/shoutouts/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    receiver_id: selectedUser.id,
                    message: message
                }),
            });

            if (response.ok) {
                navigate('/dashboard');
            } else {
                alert('Failed to post shout-out');
            }
        } catch (error) {
            console.error('Error posting shout-out:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleValue = (val) => {
        setSelectedValues(prev =>
            prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]
        );
    };

    return (
        <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom duration-500">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    Give a Shout-out 🥳
                </h2>
                <p className="text-gray-500 mt-1">Make someone's day by recognizing their hard work.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-8">
                {/* Recipient Selection */}
                <div className="space-y-4">
                    <label className="text-sm font-bold text-gray-700 block ml-1">Who do you want to recognize?</label>

                    {selectedUser ? (
                        <div className="flex items-center justify-between p-3 bg-orange-50 rounded-2xl border border-orange-200">
                            <div className="flex items-center gap-3">
                                <img
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.email}`}
                                    className="w-10 h-10 rounded-full"
                                />
                                <div>
                                    <p className="font-bold text-gray-900">{selectedUser.email}</p>
                                    <p className="text-xs text-orange-600 capitalize">{selectedUser.role}</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedUser(null)}
                                className="p-2 hover:bg-orange-100 rounded-full transition-colors"
                            >
                                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <div className="relative">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search colleagues..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:bg-white outline-none transition-all"
                            />

                            {search && filteredUsers.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-2xl shadow-xl z-10 max-h-60 overflow-y-auto overflow-hidden">
                                    {filteredUsers.map(user => (
                                        <div
                                            key={user.id}
                                            onClick={() => { setSelectedUser(user); setSearch(''); }}
                                            className="flex items-center gap-3 p-4 hover:bg-orange-50 cursor-pointer transition-colors"
                                        >
                                            <img
                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                                                className="w-8 h-8 rounded-full"
                                            />
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{user.email}</p>
                                                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Message */}
                <div className="space-y-4">
                    <label className="text-sm font-bold text-gray-700 block ml-1">Your Message</label>
                    <textarea
                        required
                        rows={5}
                        placeholder="What did they do that was awesome?"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full p-6 bg-gray-50 border-none rounded-[2rem] focus:ring-2 focus:ring-orange-500/20 focus:bg-white outline-none transition-all resize-none italic font-medium"
                    />
                </div>

                {/* Values */}
                <div className="space-y-4">
                    <label className="text-sm font-bold text-gray-700 block ml-1">Add Values</label>
                    <div className="flex flex-wrap gap-2">
                        {VALUES.map(val => (
                            <button
                                key={val}
                                type="button"
                                onClick={() => toggleValue(val)}
                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${selectedValues.includes(val)
                                    ? 'bg-orange-500 text-white border-orange-500 ring-4 ring-orange-500/20'
                                    : 'bg-white text-gray-500 border-gray-100 hover:border-orange-200'
                                    }`}
                            >
                                {val}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="pt-6 flex items-center justify-between border-t border-gray-50">
                    <div className="flex gap-4">
                        <button type="button" className="p-2 text-gray-400 hover:text-orange-500 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </button>
                        <button type="button" className="p-2 text-gray-400 hover:text-orange-500 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="px-8 py-4 text-gray-500 font-bold hover:text-gray-900 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !selectedUser || !message.trim()}
                            className="px-10 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-orange-500 disabled:opacity-50 disabled:hover:bg-gray-900 shadow-lg shadow-gray-200 transition-all active:scale-95"
                        >
                            {isSubmitting ? 'Posting...' : 'Post Shout-out'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
