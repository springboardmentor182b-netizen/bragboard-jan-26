import React, { useState } from 'react';
import { Flag, Eye, Trash2, CheckCircle } from 'lucide-react';

const FlaggedContent = () => {
  const [flaggedItems, setFlaggedItems] = useState([
    {
      id: 1,
      content: 'Great job on the presentation!',
      author: 'John Doe',
      reportedBy: 'Jane Smith',
      reason: 'Spam',
      date: '2024-02-10',
      status: 'pending'
    },
    {
      id: 2,
      content: 'Amazing work on the project delivery!',
      author: 'Alex Kumar',
      reportedBy: 'Mike Chen',
      reason: 'Inappropriate',
      date: '2024-02-09',
      status: 'pending'
    }
  ]);

  const handleApprove = (id) => {
    setFlaggedItems(items => items.filter(item => item.id !== id));
    // In real app: API call to approve
  };

  const handleDelete = (id) => {
    setFlaggedItems(items => items.filter(item => item.id !== id));
    // In real app: API call to delete
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Flagged Content</h2>
          <p className="text-sm text-gray-600 mt-1">Review and moderate reported content</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full">
          <Flag className="w-4 h-4" />
          <span className="text-sm font-semibold">{flaggedItems.length} Pending</span>
        </div>
      </div>

      {flaggedItems.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <p className="text-gray-600">No flagged content to review</p>
        </div>
      ) : (
        <div className="space-y-4">
          {flaggedItems.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <p className="text-gray-900 mb-2">{item.content}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>By: <strong>{item.author}</strong></span>
                    <span>•</span>
                    <span>Reported by: <strong>{item.reportedBy}</strong></span>
                    <span>•</span>
                    <span>{item.date}</span>
                  </div>
                </div>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                  {item.reason}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(item.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlaggedContent;
