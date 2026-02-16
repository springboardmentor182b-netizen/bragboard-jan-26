export default function Reports() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Reports</h1>
      <p className="text-gray-500">Analytics and exportable insights.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold">Monthly Engagement</h2>
          <p className="text-gray-500 text-sm mt-2">
            Shoutouts increased by 18%
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold">Top Department</h2>
          <p className="text-gray-500 text-sm mt-2">
            Engineering leads recognition
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold">User Retention</h2>
          <p className="text-gray-500 text-sm mt-2">
            92% monthly retention
          </p>
        </div>
      </div>
    </div>
  );
}
