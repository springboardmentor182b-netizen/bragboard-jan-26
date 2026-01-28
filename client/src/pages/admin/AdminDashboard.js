import React from 'react';

// This is the Admin Dashboard page component
// It shows important statistics and information for admins
function AdminDashboard() {
  
  // These are dummy numbers - in a real app, these would come from the backend
  const totalEmployees = 156;
  const totalRecognitions = 423;
  const pendingApprovals = 12;

  return (
    // Main container - this wraps everything on the page
    <div className="min-h-screen bg-gray-100 p-8">
      
      {/* Header Section - Shows welcome message */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, Admin! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Here's an overview of your BragBoard workspace
        </p>
      </div>

      {/* Stats Cards Container - This holds all three statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Total Employees */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Icon/Emoji at the top */}
          <div className="text-4xl mb-4">👥</div>
          
          {/* The big number */}
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {totalEmployees}
          </div>
          
          {/* Label explaining what the number means */}
          <div className="text-gray-600 font-medium">
            Total Employees
          </div>
          
          {/* Small description */}
          <p className="text-gray-500 text-sm mt-2">
            Registered users in the system
          </p>
        </div>

        {/* Card 2: Total Recognitions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Icon/Emoji at the top */}
          <div className="text-4xl mb-4">🎉</div>
          
          {/* The big number */}
          <div className="text-3xl font-bold text-green-600 mb-2">
            {totalRecognitions}
          </div>
          
          {/* Label explaining what the number means */}
          <div className="text-gray-600 font-medium">
            Total Recognitions
          </div>
          
          {/* Small description */}
          <p className="text-gray-500 text-sm mt-2">
            Shout-outs posted all-time
          </p>
        </div>

        {/* Card 3: Pending Approvals */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Icon/Emoji at the top */}
          <div className="text-4xl mb-4">⏳</div>
          
          {/* The big number */}
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {pendingApprovals}
          </div>
          
          {/* Label explaining what the number means */}
          <div className="text-gray-600 font-medium">
            Pending Approvals
          </div>
          
          {/* Small description */}
          <p className="text-gray-500 text-sm mt-2">
            Reports awaiting review
          </p>
        </div>

      </div>

      {/* Info Box - Shows a helpful message to the admin */}
      <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <p className="text-blue-800">
          💡 <strong>Tip:</strong> Use this dashboard to monitor employee engagement 
          and manage reported content.
        </p>
      </div>

    </div>
  );
}

// This makes the component available to use in other files
export default AdminDashboard;

