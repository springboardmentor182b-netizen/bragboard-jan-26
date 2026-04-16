import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus } from 'lucide-react';

const UserManagement = () => {

  const [users, setUsers] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Employee");
  const [department, setDepartment] = useState("IT");

  // ✅ Fetch users
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/users/");
      
      const formattedUsers = response.data.map((user) => ({
        ...user,
        initials: user.name
          .split(" ")
          .map(word => word[0])
          .join("")
          .toUpperCase(),
        color: "bg-gray-600"
      }));

      setUsers(formattedUsers);

    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Add user
  const handleAddUser = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/api/users/", {
        name,
        email,
        password: "123456",
        department,
        role: role.toLowerCase()
      });

      fetchUsers();

    } catch (error) {
      console.error("Error adding user:", error);
    }

    setName("");
    setEmail("");
    setRole("Employee");
    setDepartment("IT");
    setShowForm(false);
  };

  // ✅ Delete user
  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Delete failed");
    }
  };

  return (
    <div className="p-6">

      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">User Management</h1>

        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <UserPlus /> Add User
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="bg-white p-4 border rounded mb-4">

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full mb-2 p-2 border"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full mb-2 p-2 border"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="block w-full mb-2 p-2 border"
          >
            <option>Admin</option>
            <option>Manager</option>
            <option>Employee</option>
          </select>

          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="block w-full mb-2 p-2 border"
          >
            <option>Engineering</option>
            <option>Product</option>
            <option>Marketing</option>
            <option>IT</option>
            <option>HR</option>
          </select>

          <button
            onClick={handleAddUser}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Submit
          </button>

        </div>
      )}

      {/* TABLE */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Department</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="text-center border-t">

              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.department}</td>

              <td>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="bg-blue-900 text-white px-3 py-1 rounded hover:bg-blue-800"
                >
                  Delete
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default UserManagement;