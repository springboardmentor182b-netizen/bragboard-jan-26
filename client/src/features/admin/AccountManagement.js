import React, { useEffect, useState } from "react";
import { FileDown, FileText, Trash2, Users } from "lucide-react";

const API_BASE = process.env.REACT_APP_API_URL;

function AccountManagement() {

  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    setLoading(true);
  
    fetch(`${API_BASE}/admin/users`)
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  
    fetch(`${API_BASE}/admin/users/count`)
      .then(res => res.json())
      .then(data => setTotalUsers(data.total_users));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    fetch(`${API_BASE}/admin/users/${id}`, {
      method: "DELETE"
    }).then(() => fetchUsers());
  };

  const downloadCSV = () => {
    window.location.href = `${API_BASE}/admin/users/export/csv`;
  };

  const downloadPDF = () => {
    window.location.href = `${API_BASE}/admin/users/export/pdf`;
  };

  return (
    <div className="report-container">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Account Management</h2>
          <p className="text-gray-500">Manage and export registered users</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={downloadCSV}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <FileDown size={18} /> Export CSV
          </button>
          <button 
            onClick={downloadPDF}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <FileText size={18} /> Export PDF
          </button>
        </div>
      </div>
  
      {/* Total users */}
      <div className="stat-card purple mb-8 max-w-[250px]">
        <div className="stat-icon"><Users size={24} /></div>
        <div className="stat-content">
          <div className="stat-value">{totalUsers}</div>
          <div className="stat-label">Total Users</div>
        </div>
      </div>
  
      {/* USERS GRID */}
      <div className="users-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <div className="user-card bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow" key={user.id}>
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              {user.full_name ? user.full_name[0].toUpperCase() : user.email[0].toUpperCase()}
            </div>
  
            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-800 truncate">{user.full_name || "N/A"}</h4>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">ID: {user.id}</span>
                <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium truncate max-w-[100px]">{user.department || "General"}</span>
              </div>
            </div>
  
            {/* Action */}
            <button
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
              onClick={() => deleteUser(user.id)}
              title="Delete User"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AccountManagement;