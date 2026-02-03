import React, { useState } from 'react';
import { Send } from 'lucide-react';

const CreateShoutoutPage = () => {
  const [formData, setFormData] = useState({
    recipient: '',
    message: '',
    category: 'teamwork',
  });

  const categories = [
    { value: 'teamwork', label: 'Teamwork' },
    { value: 'innovation', label: 'Innovation' },
    { value: 'leadership', label: 'Leadership' },
    { value: 'helpfulness', label: 'Helpfulness' },
    { value: 'excellence', label: 'Excellence' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Shoutout creation will be implemented!');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Create Shoutout</h1>
        <p className="text-accent1">Recognize and appreciate your colleagues!</p>
      </div>

      <div className="bg-white rounded-lg p-8 shadow-md border-2 border-accent2 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Who do you want to recognize?
            </label>
            <input
              type="text"
              value={formData.recipient}
              onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
              className="w-full px-4 py-3 border-2 border-accent2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent1"
              placeholder="Search for a team member..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border-2 border-accent2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent1"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Your Message
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows="6"
              className="w-full px-4 py-3 border-2 border-accent2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent1 resize-none"
              placeholder="Write something nice about this person..."
              required
            />
            <p className="text-sm text-accent1 mt-2">{formData.message.length} / 500 characters</p>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-primary text-secondary py-3 px-6 rounded-lg hover:bg-accent1 transition-colors font-semibold"
          >
            <Send className="w-5 h-5" />
            Send Shoutout
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateShoutoutPage;
