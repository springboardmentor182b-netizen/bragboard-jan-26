import React from 'react';

const ShoutoutCard = ({ data }) => {
  // Parse tags if they are a string
  const tags = data.tags ? data.tags.split(',') : [];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg">
            {data.sender.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">
              {data.sender.name} <span className="text-gray-400 font-normal text-sm">recognized</span>
            </h3>
            <div className="flex gap-2 mt-1">
              {data.recipients.map((r, index) => (
                <span key={index} className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-md">
                  @{r.recipient.name}
                </span>
              ))}
            </div>
          </div>
        </div>
        <span className="text-gray-400 text-sm">Just now</span>
      </div>

      <p className="text-gray-600 mb-4 leading-relaxed">
        {data.message}
      </p>

      {/* Tags */}
      <div className="flex gap-2 mb-6">
        {tags.map((tag, idx) => (
          <span key={idx} className="border border-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">
            {tag}
          </span>
        ))}
      </div>

      {/* Reactions Footer */}
      <div className="flex items-center gap-6 border-t border-gray-100 pt-4">
        <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors">
          <span>❤️</span> <span className="text-sm font-medium">12</span>
        </button>
        <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
          <span>👏</span> <span className="text-sm font-medium">5</span>
        </button>
      </div>
    </div>
  );
};

export default ShoutoutCard;