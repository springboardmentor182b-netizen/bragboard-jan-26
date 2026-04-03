import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserManagement.css';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // 🔒 No hardcoded URL here. We pull it from the system environment.
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // ✅ CLEAN: No direct URL
                const response = await axios.get(`${API_BASE_URL}/users`);
                
                console.log("DEBUG: Data received from server:", response.data);

                // 🔄 Smart Data Handling
                let userData = [];
                if (Array.isArray(response.data)) {
                    // Case: [...]
                    userData = response.data;
                } else if (response.data.users && Array.isArray(response.data.users)) {
                    // Case: {"users": [...]}
                    userData = response.data.users;
                } else if (typeof response.data === 'object' && response.data !== null) {
                    // Case: Any other object containing a list
                    const possibleList = Object.values(response.data).find(val => Array.isArray(val));
                    userData = possibleList || [];
                }

                setUsers(userData);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        
        if (API_BASE_URL) {
            fetchUsers();
        }
    }, [API_BASE_URL]);

    // Filter logic for the search bar
    const filteredUsers = users.filter(user => 
        (user.name || user.username || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="user-management-container">
            <div className="table-header-actions">
                <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input 
                        type="text" 
                        placeholder="Search users..." 
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="add-user-btn">
                    <FaPlus /> Add User
                </button>
            </div>

            <table className="user-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Joined Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td className="user-name-cell">
                                    {/* Using both name/username to prevent empty cells */}
                                    <strong>{user.name || user.username}</strong>
                                </td>
                                <td>{user.email}</td>
                                <td>{user.department || 'Engineering'}</td>
                                <td><span className="role-badge">{user.role || 'Employee'}</span></td>
                                <td>
                                    <span className={`status-badge ${user.status?.toLowerCase() || 'active'}`}>
                                        {user.status || 'Active'}
                                    </span>
                                </td>
                                <td>{user.joined_date || '2026-01-01'}</td>
                                <td className="actions-cell">
                                    <button className="edit-btn"><FaEdit /></button>
                                    <button className="delete-btn"><FaTrash /></button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                                No users found in database.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagement;