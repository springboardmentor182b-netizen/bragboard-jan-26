import React, { useState, useEffect } from 'react';

const FlaggedContent = () => {
  const [flaggedItems, setFlaggedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchFlaggedContent();
  }, [filter]);

  const fetchFlaggedContent = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8000/api/admin/flagged-content?status=${filter}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFlaggedItems(data.flaggedContent || []);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching flagged content:', error);
      setLoading(false);
    }
  };

  const handleAction = async (reportId, action) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8000/api/admin/reports/${reportId}/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setSelectedItem(null);
        fetchFlaggedContent();
      }
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
    }
  };

  const handleDeleteContent = async (shoutoutId, reportId) => {
    if (!window.confirm('Are you sure you want to delete this shout-out? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8000/api/admin/shoutouts/${shoutoutId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await handleAction(reportId, 'resolve');
      }
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Content Moderation</h2>
          <p className="text-sm text-gray-500 mt-1">Review and manage flagged content</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Reports</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="dismissed">Dismissed</option>
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : flaggedItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">All Clear!</h3>
          <p className="text-gray-500">No flagged content to review</p>
        </div>
      ) : (
        <div className="space-y-4">
          {flaggedItems.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-6">
                {/* Report Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(item.severity)}`}>
                      {item.reason || 'Inappropriate Content'}
                    </span>
                    <span className="text-sm text-gray-500">
                      Reported {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {item.status === 'pending' && (
                      <>
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Review
                        </button>
                      </>
                    )}
                    {item.status !== 'pending' && (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Reported Content */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                      {item.shoutout?.sender?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.shoutout?.sender?.name || 'Unknown User'}</p>
                      <p className="text-sm text-gray-500">{item.shoutout?.sender?.department || 'N/A'}</p>
                    </div>
                  </div>
                  <p className="text-gray-700">{item.shoutout?.message || 'Content not available'}</p>
                  {item.shoutout?.recipients && item.shoutout.recipients.length > 0 && (
                    <div className="mt-3 flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Tagged:</span>
                      <div className="flex flex-wrap gap-2">
                        {item.shoutout.recipients.map((recipient, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                            {recipient.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Reporter Info */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <span>Reported by:</span>
                    <span className="font-medium">{item.reportedBy?.name || 'Anonymous'}</span>
                  </div>
                  <div className="text-gray-500">
                    Report ID: #{item.id}
                  </div>
                </div>
              </div>

              {/* Review Modal */}
              {selectedItem?.id === item.id && (
                <div className="bg-gray-50 border-t border-gray-200 p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Take Action</h4>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleDeleteContent(item.shoutout?.id, item.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Delete Content
                    </button>
                    <button
                      onClick={() => handleAction(item.id, 'dismiss')}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Dismiss Report
                    </button>
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlaggedContent;