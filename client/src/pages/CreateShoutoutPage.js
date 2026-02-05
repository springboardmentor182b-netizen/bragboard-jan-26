import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { shoutoutService } from '../services/shoutoutService';
import { categoryService } from '../services/categoryService';

const CreateShoutoutPage = () => {
  const [formData, setFormData] = useState({
    recipient: '',
    message: '',
    category: '',
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
      if (data.length > 0) {
        setFormData(prev => ({ ...prev, category: data[0].value }));
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      const defaultCategories = [
        { value: 'teamwork', label: 'Teamwork' },
        { value: 'innovation', label: 'Innovation' },
        { value: 'leadership', label: 'Leadership' },
        { value: 'helpfulness', label: 'Helpfulness' },
        { value: 'excellence', label: 'Excellence' },
      ];
      setCategories(defaultCategories);
      setFormData(prev => ({ ...prev, category: 'teamwork' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await shoutoutService.createShoutout(formData);
      setSuccess(true);
      setFormData({
        recipient: '',
        message: '',
        category: categories[0]?.value || 'teamwork',
      });
    } catch (err) {
      setError(err.detail || 'Failed to create shoutout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Create Shoutout</h1>
        <p className="text-accent1">Recognize and appreciate your colleagues!</p>
      </div>

      <div className="bg-white rounded-lg p-8 shadow-md border-2 border-accent2 max-w-2xl">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            Shoutout sent successfully! 🎉
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Who do you want to recognize? *
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
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border-2 border-accent2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent1"
              required
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
              Your Message *
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows="6"
              maxLength="500"
              className="w-full px-4 py-3 border-2 border-accent2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent1 resize-none"
              placeholder="Write something nice about this person..."
              required
            />
            <p className="text-sm text-accent1 mt-2">{formData.message.length} / 500 characters</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary text-secondary py-3 px-6 rounded-lg hover:bg-accent1 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
            {loading ? 'Sending...' : 'Send Shoutout'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateShoutoutPage;
