import React, { useEffect, useState } from "react";

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

    fetch(`${API_BASE}/admin/users/${id}`, {
      method: "DELETE"
    }).then(() => fetchUsers());

  };

  return (
    <div className="report-container">
  
      <h2>Account Management</h2>
      <p style={{ color: "#777" }}>
        Manage all registered users
      </p>
  
      {/* Total users */}
      <div className="card" style={{ marginTop: "20px", width: "250px" }}>
        <h3>Total Users</h3>
        <h1>{totalUsers}</h1>
      </div>
  
      {/* USERS GRID */}
      <div className="users-grid">
  
        {users.map(user => (
  
          <div className="user-card" key={user.id}>
  
            {/* Avatar */}
            <div className="avatar">
              {user.email[0].toUpperCase()}
            </div>
  
            {/* Info */}
            <div className="user-info">
              <p><b>ID:</b> {user.id}</p>
              <p><b>Email:</b> {user.email}</p>
            </div>
  
            {/* Action */}
            <button
              className="btn btn-delete"
              onClick={() => deleteUser(user.id)}
            >
              Delete
            </button>
  
          </div>
  
        ))}
  
      </div>
  
    </div>
  );

}

export default AccountManagement;