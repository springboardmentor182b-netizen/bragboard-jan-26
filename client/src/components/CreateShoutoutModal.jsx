import React, { useState } from 'react';
import { X } from 'lucide-react';

const CreateShoutoutModal = ({ isOpen, onClose, onPost }) => {
  const [message, setMessage] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  
  if (!isOpen) return null;

  const availableTags = ["Teamwork", "Innovation", "Leadership", "Problem Solving", "Customer Service"];

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = () => {
    // In a real app, you'd select real users. For now we hardcode recipient ID 2
    onPost({ message, recipient_ids: [2], tags: selectedTags });
    setMessage('');
    setSelectedTags([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl transform transition-all">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Give a Shout-out 👏</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Who do you want to recognize?</label>
            <select className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
              <option>Select a colleague...</option>
              <option value="2">Mike Chen (Engineering)</option>
              <option value="3">Jessica Lee (Design)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
            <textarea 
              rows="4"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="What did they do that was awesome?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Core Values</label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-50 rounded-lg">
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-md"
          >
            Post Shout-out
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateShoutoutModal;