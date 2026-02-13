import React, { useState } from 'react';
import { Search, Filter, Download, UserPlus, Shield, Users as UsersIcon } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      initials: 'SJ',
      email: 'sarah.johnson@company.com',
      role: 'Admin',
      department: 'Engineering',
      status: 'Active',
      color: 'bg-blue-600'
    },
    {
      id: 2,
      name: 'Mike Chen',
      initials: 'MC',
      email: 'mike.chen@company.com',
      role: 'Manager',
      department: 'Product',
      status: 'Active',
      color: 'bg-purple-600'
    },
    {
      id: 3,
      name: 'Emma Wilson',
      initials: 'EW',
      email: 'emma.wilson@company.com',
      role: 'Employee',
      department: 'Marketing',
      status: 'Active',
      color: 'bg-green-600'
    },
    {
      id: 4,
      name: 'Alex Kumar',
      initials: 'AK',
      email: 'alex.kumar@company.com',
      role: 'Employee',
      department: 'Engineering',
      status: 'Active',
      color: 'bg-orange-600'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All Roles');

  const stats = [
    { label: 'Total Users', value: 10, color: 'bg-blue-100', iconColor: 'text-blue-600' },
    { label: 'Active', value: 9, color: 'bg-green-100', iconColor: 'text-green-600' },
    { label: 'Admins', value: 2, color: 'bg-red-100', iconColor: 'text-red-600' },
    { label: 'Managers', value: 3, color: 'bg-purple-100', iconColor: 'text-purple-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage user accounts, roles, and permissions</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium">
          <UserPlus className="w-5 h-5" />
          Add New User
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
              </div>
              <div className={`${stat.color} p-3 rounded-full`}>
                <UsersIcon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              <option>All Roles</option>
              <option>Admin</option>
              <option>Manager</option>
              <option>Employee</option>
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-gray-900">All Users</h3>
              <p className="text-sm text-gray-600">10 users found</p>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              10 Total
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${user.color} rounded-full flex items-center justify-center text-white font-semibold`}>
                        {user.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-700">{user.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'Admin' ? 'bg-red-100 text-red-700' :
                      user.role === 'Manager' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-700">{user.department}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
