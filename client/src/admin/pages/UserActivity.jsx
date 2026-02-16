export default function UserActivity() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">User Activity</h1>
      <p className="text-gray-500">Recent user actions across the platform.</p>

      <div className="bg-white rounded-xl shadow p-6">
        <ul className="space-y-3">
          <li>Jordan posted a shoutout • 2 mins ago</li>
          <li>Sarah logged in • 15 mins ago</li>
          <li>Marcus updated profile • 1 hour ago</li>
          <li className="text-red-500">
            David failed login attempt • 4 hours ago
          </li>
        </ul>
      </div>
    </div>
  );
}
