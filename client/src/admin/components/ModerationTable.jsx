export default function ModerationTable() {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Recent Flags</h2>
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th>Content</th>
            <th>Reason</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td>Shoutout #1201</td>
            <td className="text-red-500">Inappropriate</td>
            <td>Pending</td>
          </tr>
          <tr>
            <td>Shoutout #1202</td>
            <td className="text-red-500">Spam</td>
            <td>Resolved</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
