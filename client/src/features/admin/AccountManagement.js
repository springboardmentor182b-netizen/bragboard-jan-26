import React, { useEffect, useState } from "react";

const API_BASE = "http://127.0.0.1:8000";

function AccountManagement() {

  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);


  const fetchUsers = () => {

    fetch(`${API_BASE}/admin/users`)
      .then(res => res.json())
      .then(data => setUsers(data));

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

    <div style={{padding:"20px"}}>

      <h1>Account Management</h1>

      <h3>Total Users: {totalUsers}</h3>

      {users.map(user => (

        <div
          key={user.id}
          style={{
            border:"1px solid #ccc",
            padding:"10px",
            marginBottom:"10px",
            borderRadius:"8px"
          }}
        >

          <p><b>ID:</b> {user.id}</p>
          <p><b>Email:</b> {user.email}</p>

          <button
            onClick={() => deleteUser(user.id)}
          >
            Delete User
          </button>

        </div>

      ))}

    </div>

  );

}

export default AccountManagement;