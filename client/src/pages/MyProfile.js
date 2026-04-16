import React from 'react';

const MyProfile = () => {
  const userEmail = localStorage.getItem('email');
  const userName = localStorage.getItem('user_name') || 'User';
  
  return (
    <div className="bg-white border-b border-gray-200 px-8 py-6">
      <h1 className="text-3xl font-bold text-[#213555]">My Profile</h1>
      <p className="text-[#3E5879] mt-1">View your information and recognition statistics</p>
      
      <div className="mt-8 max-w-2xl">
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-[#213555] flex items-center justify-center text-white font-bold text-2xl">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#213555]">{userName}</h2>
              <p className="text-[#3E5879]">{userEmail}</p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-semibold text-[#213555] mb-2">Account Information</h3>
            <p className="text-sm text-[#3E5879]">Email: {userEmail}</p>
            <p className="text-sm text-[#3E5879]">Role: Employee</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
