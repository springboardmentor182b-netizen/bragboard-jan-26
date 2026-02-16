export default function Dashboard() {
  return (
    <div className='space-y-8'>
      <h1 className='text-3xl font-bold'>Admin Overview</h1>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white p-6 rounded-xl shadow'>
          <p className='text-gray-500'>Total Shout-outs</p>
          <p className='text-3xl font-bold'>1,248</p>
        </div>

        <div className='bg-white p-6 rounded-xl shadow'>
          <p className='text-gray-500'>Active Users</p>
          <p className='text-3xl font-bold text-green-600'>856</p>
        </div>

        <div className='bg-white p-6 rounded-xl shadow'>
          <p className='text-gray-500'>Flagged Content</p>
          <p className='text-3xl font-bold text-red-600'>3</p>
        </div>
      </div>

      <div className='bg-white rounded-xl shadow p-6'>
        <h2 className='text-xl font-semibold mb-4'>Moderation Queue</h2>
        <table className='w-full'>
          <thead>
            <tr className='text-left text-gray-500'>
              <th>Content</th>
              <th>Reason</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr className='border-t'>
              <td>Shout-out #1001</td>
              <td className='text-red-600'>Inappropriate</td>
              <td>Feb 11</td>
            </tr>
            <tr className='border-t'>
              <td>Shout-out #1002</td>
              <td className='text-red-600'>Inappropriate</td>
              <td>Feb 12</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
