import React from "react";

function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-blue-900 text-white flex flex-col justify-between">

      {/* Top Section */}
      <div>
        <div className="p-6 text-2xl font-bold border-b border-blue-700">
          BragBoard
        </div>

        <nav className="p-4 space-y-2">
          <div className="bg-blue-700 px-4 py-2 rounded">
            📊 Dashboard
          </div>

          <div className="px-4 py-2 hover:bg-blue-800 rounded cursor-pointer">
            👥 User Management
          </div>

          <div className="px-4 py-2 hover:bg-blue-800 rounded cursor-pointer">
            💬 Shout-outs Management
          </div>

          <div className="px-4 py-2 hover:bg-blue-800 rounded cursor-pointer">
            📄 Reports
          </div>
        </nav>

        {/* Quick Stats */}
        <div className="px-4 mt-6">
          <h2 className="font-semibold mb-2">Quick Stats</h2>
          <div className="text-sm space-y-1 text-gray-200">
            <div>Active Users: 120</div>
            <div>Administrators: 5</div>
            <div>Managers: 12</div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-blue-700">
        <div className="text-sm mb-3">admin@company.com</div>
        <button className="w-full bg-red-500 hover:bg-red-600 py-2 rounded">
          Logout
        </button>
      </div>

    </div>
  );
}

export default Sidebar;
