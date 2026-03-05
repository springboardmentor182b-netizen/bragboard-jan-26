import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';

const ShoutoutsManagement = () => {
  const [shoutouts, setShoutouts] = useState([
    {
      id: 1,
      title: 'New Design System Implementation',
      author: 'Alex Turner',
      authorInitials: 'AT',
      content: 'Successfully rolled out the new design system across all products',
      date: '2 days ago',
      status: 'Completed',
      comments: [
        { id: 1, author: 'Sarah J.', authorInitials: 'SJ', text: 'Great work on this!', time: '1h ago' },
        { id: 2, author: 'Mike C.', authorInitials: 'MC', text: 'Very impressive', time: '3h ago' }
      ]
    }
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Creations & Comments</h1>
          <p className="text-gray-600 mt-1">Showcase team accomplishments</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white font-semibold">
            AD
          </div>
        </div>
      </div>

      {/* Team Creations Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Team Creations & Achievements</h2>
          <p className="text-sm text-gray-600">Share and celebrate team accomplishments</p>
        </div>

        {/* Add New Creation Button */}
        <button className="w-full flex items-center justify-center gap-2 py-4 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium mb-6">
          <Plus className="w-5 h-5" />
          Add New Creation
        </button>

        {/* Shoutouts List */}
        <div className="space-y-6">
          {shoutouts.map((shoutout) => (
            <div key={shoutout.id} className="border border-gray-200 rounded-lg p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-gray-900">{shoutout.title}</h3>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  {shoutout.status}
                </span>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <span>by <strong>{shoutout.author}</strong></span>
                <span>•</span>
                <span>{shoutout.date}</span>
              </div>

              {/* Content */}
              <p className="text-gray-700 mb-6">{shoutout.content}</p>

              {/* Comments Section */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Comments ({shoutout.comments.length})
                </h4>

                <div className="space-y-4">
                  {shoutout.comments.map((comment) => (
                    <div key={comment.id} className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {comment.authorInitials}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">{comment.author}</span>
                          <span className="text-xs text-gray-500">{comment.time}</span>
                        </div>
                        <p className="text-gray-700">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShoutoutsManagement;
