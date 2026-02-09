import React from "react";

function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* ===== SIDEBAR ===== */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-blue-700">
          BragBoard
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <div className="bg-blue-700 px-4 py-2 rounded">📊 Dashboard</div>
          <div className="px-4 py-2 hover:bg-blue-800 rounded cursor-pointer">
            👥 Users Managements
          </div>
          <div className="px-4 py-2 hover:bg-blue-800 rounded cursor-pointer">
            💬 Shout-outs Management
          </div>
          <div className="px-4 py-2 hover:bg-blue-800 rounded cursor-pointer">
            📄 Reports
          </div>
        </nav>

        <div className="p-4 border-t border-blue-700 cursor-pointer hover:bg-blue-800">
          🚪 Logout
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Analytics & Admin Tools
            </h1>
            <p className="text-gray-600">
              Monitor platform performance
            </p>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 border rounded-lg"
            />
            <div className="w-10 h-10 bg-blue-700 text-white rounded-full flex items-center justify-center font-bold">
              AD
            </div>
          </div>
        </div>

        {/* Analytics List */}
        <div className="bg-white rounded-lg shadow mb-8 p-6">
          <h2 className="text-lg font-semibold mb-4">Top Contributors</h2>

          {[
            { rank: 3, name: "Emma Wilson", score: 24, change: "+15" },
            { rank: 4, name: "David Park", score: 21, change: "+6" },
            { rank: 5, name: "Lisa Anderson", score: 19, change: "+10" },
          ].map((user) => (
            <div
              key={user.rank}
              className="flex justify-between items-center border-b py-3 last:border-none"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-blue-700 text-white rounded-full flex items-center justify-center">
                  {user.rank}
                </div>
                <div className="font-medium">{user.name}</div>
              </div>

              <div className="flex items-center gap-6">
                <span className="text-green-600">{user.change}</span>
                <span className="font-bold text-blue-700">{user.score}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Admin Tools */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-1">Admin Tools</h2>
          <p className="text-gray-500 mb-6">
            Manage platform settings and user permissions
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border rounded-lg hover:shadow cursor-pointer">
              👥 <strong>User Management</strong>
              <p className="text-sm text-gray-500">
                Manage user roles and permissions
              </p>
            </div>

            <div className="p-4 border rounded-lg hover:shadow cursor-pointer">
              ⚙️ <strong>Platform Settings</strong>
              <p className="text-sm text-gray-500">
                Configure platform preferences
              </p>
            </div>

            <div className="p-4 border rounded-lg hover:shadow cursor-pointer">
              📊 <strong>Export Reports</strong>
              <p className="text-sm text-gray-500">
                Download analytics and reports
              </p>
            </div>

            <div className="p-4 border rounded-lg hover:shadow cursor-pointer">
              🛡️ <strong>Moderation</strong>
              <p className="text-sm text-gray-500">
                Review and moderate content
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default AdminDashboard;
