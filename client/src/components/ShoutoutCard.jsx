import React from 'react';

const ShoutoutCard = ({ data }) => {
  const tags = data.tags ? data.tags.split(',') : [];

  // 1. Calculate Reaction Counts dynamically
  // We filter the reactions list to count how many 'likes' vs 'claps'
  const likeCount = data.reactions ? data.reactions.filter(r => r.type === 'like').length : 0;
  const clapCount = data.reactions ? data.reactions.filter(r => r.type === 'clap').length : 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
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
        <span className="text-gray-400 text-sm">
            {new Date(data.created_at).toLocaleDateString()}
        </span>
      </div>

      <p className="text-gray-600 mb-4 leading-relaxed">
        {data.message}
      </p>

      <div className="flex gap-2 mb-6">
        {tags.map((tag, idx) => (
          <span key={idx} className="border border-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">
            {tag}
          </span>
        ))}
      </div>

      {/* 2. Display Real Counts */}
      <div className="flex items-center gap-6 border-t border-gray-100 pt-4">
        <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors">
          <span>❤️</span> <span className="text-sm font-medium">{likeCount}</span>
        </button>
        <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
          <span>👏</span> <span className="text-sm font-medium">{clapCount}</span>
        </button>
      </div>
    </div>
  );
};

export default ShoutoutCard;