import React from 'react';

const MyProfile = () => {
  const userEmail = localStorage.getItem('email');
  
  return (
    <div>
      <h1>My Profile</h1>
      <p>Email: {userEmail}</p>
    </div>
  );
};

export default MyProfile;
