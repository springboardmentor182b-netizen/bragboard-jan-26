import React, { useState } from 'react';
import { Search, Image, Smile, AtSign } from 'lucide-react';

const PostShoutout = () => {
    const [message, setMessage] = useState('');
    const [selectedValues, setSelectedValues] = useState([]);

    const values = ['Teamwork', 'Innovation', 'Customer Love', 'Leadership', 'Ownership', 'Growth'];

    const toggleValue = (value) => {
        if (selectedValues.includes(value)) {
            setSelectedValues(selectedValues.filter(v => v !== value));
        } else {
            setSelectedValues([...selectedValues, value]);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search colleagues..."
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-secondary-200 focus:border-primary-300 focus:ring-4 focus:ring-primary-100 outline-none transition-all placeholder:text-secondary-400"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-secondary-100 p-8">
                {/* Tag Colleagues */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-secondary-900 mb-2">Tag other colleagues</label>
                    <div className="relative">
                        <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                        <input
                            type="text"
                            placeholder="Start typing names..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-secondary-200 bg-secondary-50 focus:bg-white focus:border-primary-300 focus:ring-4 focus:ring-primary-100 outline-none transition-all text-sm"
                        />
                    </div>
                    <p className="text-secondary-400 text-xs mt-2">Add multiple people to this shout-out</p>
                </div>

                {/* Message */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-secondary-900 mb-2">Your Message</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="What did they do that was awesome?"
                        className="w-full p-4 h-40 rounded-xl border border-secondary-200 focus:border-primary-300 focus:ring-4 focus:ring-primary-100 outline-none transition-all resize-none font-medium text-secondary-700 placeholder:text-secondary-400"
                    ></textarea>
                </div>

                {/* Values */}
                <div className="mb-8">
                    <label className="block text-sm font-semibold text-secondary-900 mb-3">Add Values</label>
                    <div className="flex flex-wrap gap-2">
                        {values.map(value => (
                            <button
                                key={value}
                                onClick={() => toggleValue(value)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${selectedValues.includes(value)
                                        ? 'bg-primary-50 text-primary-700 border-primary-200'
                                        : 'bg-white text-secondary-600 border-secondary-200 hover:border-secondary-300 hover:bg-secondary-50'
                                    }`}
                            >
                                {value}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-secondary-100">
                    <div className="flex gap-4">
                        <button className="text-secondary-400 hover:text-secondary-600 transition-colors">
                            <Image size={24} />
                        </button>
                        <button className="text-secondary-400 hover:text-secondary-600 transition-colors">
                            <Smile size={24} />
                        </button>
                    </div>

                    <div className="flex gap-3">
                        <button className="px-6 py-2.5 rounded-xl font-semibold text-secondary-600 hover:bg-secondary-50 transition-colors border border-secondary-200 hover:border-secondary-300">
                            Cancel
                        </button>
                        <button className="px-6 py-2.5 rounded-xl font-semibold text-white bg-secondary-900 hover:bg-black transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                            Post Shout-out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostShoutout;
