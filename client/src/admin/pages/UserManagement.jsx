import { useState, useEffect } from "react";

export default function UserManagement() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/users/")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">User Management</h1>
      <p className="text-gray-500">Manage employee accounts and access.</p>

      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="border-b">
                  <td>{user.email}</td>
                  <td className="capitalize">{user.role}</td>
                  <td className="text-green-600 font-medium">Active</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-400">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

