import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, FileText, X, Check, Clock, Target } from 'lucide-react';

const Reports = () => {
  const [creations, setCreations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: '',
    status: 'completed'
  });
  const [loading, setLoading] = useState(false);

  // Fetch creations on mount
  useEffect(() => {
    fetchCreations();
  }, []);

  const fetchCreations = async () => {
    try {
      // Placeholder - replace with actual API when ready
      const mockCreations = [
        {
          id: 1,
          title: 'New Design System Implementation',
          description: 'Successfully rolled out the new design system across all products',
          author: 'Alex Turner',
          status: 'completed',
          created_at: '2 days ago'
        },
        {
          id: 2,
          title: 'Q4 Marketing Campaign',
          description: 'Launched comprehensive marketing campaign for product launch',
          author: 'Sarah Chen',
          status: 'completed',
          created_at: '5 days ago'
        }
      ];
      setCreations(mockCreations);
    } catch (error) {
      console.error('Error fetching creations:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCreation = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Replace with actual API endpoint when backend is ready
      // const response = await axios.post('http://localhost:8000/api/creations/', formData);
      
      // Temporary: Add to local state
      const newCreation = {
        id: creations.length + 1,
        ...formData,
        created_at: 'Just now'
      };

      setCreations([newCreation, ...creations]);
      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        author: '',
        status: 'completed'
      });
      alert('Creation added successfully!');
    } catch (error) {
      console.error('Error adding creation:', error);
      alert(`Failed to add creation: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <Check className="w-5 h-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'planned':
        return <Target className="w-5 h-5 text-orange-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-700',
      in_progress: 'bg-blue-100 text-blue-700',
      planned: 'bg-orange-100 text-orange-700'
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusLabel = (status) => {
    const labels = {
      completed: 'Completed',
      in_progress: 'In Progress',
      planned: 'Planned'
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Creations & Comments</h1>
          <p className="text-gray-600 mt-1">Showcase team accomplishments</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Add New Creation
        </button>
      </div>

      {/* Section Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <FileText className="w-6 h-6 text-blue-700" />
          <h2 className="text-xl font-bold text-gray-900">Team Creations & Achievements</h2>
        </div>
        <p className="text-gray-600">Share and celebrate team accomplishments</p>
      </div>

      {/* Creations List */}
      <div className="space-y-4">
        {creations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-100 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Creations Yet</h3>
            <p className="text-gray-600 mb-4">Start showcasing your team's achievements</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add First Creation
            </button>
          </div>
        ) : (
          creations.map((creation) => (
            <div key={creation.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{creation.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    by {creation.author} • {creation.created_at}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusBadge(creation.status)}`}>
                  {getStatusIcon(creation.status)}
                  {getStatusLabel(creation.status)}
                </span>
              </div>

              <p className="text-gray-800 leading-relaxed mb-4">{creation.description}</p>

              {/* Comments Section (placeholder) */}
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Comments (2)</p>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      SJ
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-lg p-3">
                      <p className="font-semibold text-sm text-gray-900">Sarah J.</p>
                      <p className="text-sm text-gray-700 mt-1">Great work on this!</p>
                      <p className="text-xs text-gray-400 mt-1">1h ago</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      MC
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-lg p-3">
                      <p className="font-semibold text-sm text-gray-900">Mike C.</p>
                      <p className="text-sm text-gray-700 mt-1">Very impressive</p>
                      <p className="text-xs text-gray-400 mt-1">3h ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Add New Creation</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddCreation} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Q4 Product Launch Success"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Describe the achievement, creation, or milestone..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author/Team *
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Name or team name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="completed">Completed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="planned">Planned</option>
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <div className="flex gap-2">
                  <FileText className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 text-sm mb-1">Tips for Great Creations</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Be specific about what was accomplished</li>
                      <li>• Mention the impact or results</li>
                      <li>• Recognize team effort and collaboration</li>
                      <li>• Keep it positive and celebratory</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium disabled:bg-gray-400"
                >
                  {loading ? 'Adding...' : 'Add Creation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
