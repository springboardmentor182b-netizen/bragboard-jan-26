import React, { useState } from 'react';
import { HelpCircle, MessageSquare, Book, FileText, Send } from 'lucide-react';

const Help = () => {
    const [issue, setIssue] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the issue to the backend
        if (issue.trim()) {
            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
                setIssue('');
            }, 3000);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-brand-yellow/10 rounded-xl text-brand-orange">
                        <HelpCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Help & Support</h2>
                        <p className="text-gray-500 text-sm mt-1">Get assistance and report any problems</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: Report Issue */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4 border-b pb-2">
                            <MessageSquare className="w-5 h-5 text-gray-400" /> Report a Problem
                        </h3>
                        {submitted ? (
                            <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-3 border border-green-200">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">✓</div>
                                <div>
                                    <p className="font-bold">Thank you!</p>
                                    <p className="text-sm">Your report has been submitted. Our team will look into it.</p>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Describe the issue
                                    </label>
                                    <textarea
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all resize-none"
                                        rows="5"
                                        placeholder="What seems to be the problem? Please provide details..."
                                        value={issue}
                                        onChange={(e) => setIssue(e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-brand-orange hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
                                >
                                    <Send className="w-4 h-4" /> Submit Report
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Right Column: Quick Links & FAQs */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4 border-b pb-2">
                            <Book className="w-5 h-5 text-gray-400" /> Resources
                        </h3>
                        <div className="space-y-4">
                            <a href="#" className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-brand-orange/5 rounded-xl border border-transparent hover:border-brand-orange/20 transition-all group">
                                <div className="bg-white p-2 rounded-lg shadow-sm text-gray-400 group-hover:text-brand-orange transition-colors">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800">User Guide</h4>
                                    <p className="text-xs text-gray-500">Learn how to use BragBoard</p>
                                </div>
                            </a>

                            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                                <h4 className="font-semibold text-gray-800 mb-3">Frequently Asked Questions</h4>
                                <div className="space-y-4">
                                    <div className="text-sm">
                                        <p className="font-medium text-gray-800">How do I give a shoutout?</p>
                                        <p className="text-gray-500 mt-1">Navigate to "Create Shout Out" from the sidebar, select a colleague, write your message, and hit post!</p>
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-medium text-gray-800">Can I delete a shoutout?</p>
                                        <p className="text-gray-500 mt-1">Currently, you can delete your own shoutouts by going to "My Shout Outs" and clicking the delete icon.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Help;
