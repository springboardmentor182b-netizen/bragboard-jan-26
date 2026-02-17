export default function Shoutouts() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Shoutout Management</h1>
      <p className="text-gray-500">Review and manage employee shoutouts.</p>

      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <div className="border-b pb-3">
          <p className="font-medium">Sarah to Marcus</p>
          <p className="text-gray-500 text-sm">
            Huge thanks for helping with the release!
          </p>
        </div>

        <div className="border-b pb-3">
          <p className="font-medium">Alex to Jessica</p>
          <p className="text-gray-500 text-sm">
            Amazing leadership during the sprint.
          </p>
        </div>

        <div>
          <p className="font-medium">David to Emily</p>
          <p className="text-gray-500 text-sm">
            Handled the client escalation perfectly.
          </p>
        </div>
      </div>
    </div>
  );
}
