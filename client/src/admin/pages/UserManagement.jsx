export default function UserManagement() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">User Management</h1>
      <p className="text-gray-500">Manage employee accounts and access.</p>

      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td>Jordan Smith</td>
              <td>Product Manager</td>
              <td className="text-green-600 font-medium">Active</td>
            </tr>
            <tr className="border-b">
              <td>Sarah Chen</td>
              <td>Designer</td>
              <td className="text-green-600 font-medium">Active</td>
            </tr>
            <tr>
              <td>David Kim</td>
              <td>Engineer</td>
              <td className="text-red-500 font-medium">Inactive</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
