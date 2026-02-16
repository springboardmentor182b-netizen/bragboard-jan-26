export default function Moderation() {
  return (
    <div className='space-y-8'>
      <h1 className='text-3xl font-bold'>Moderation</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='bg-white p-6 rounded-xl shadow flex justify-between items-center'>
          <div>
            <p className='text-gray-500'>Pending Review</p>
            <p className='text-3xl font-bold'>12</p>
          </div>
          <span className='text-orange-500 text-3xl'>??</span>
        </div>

        <div className='bg-white p-6 rounded-xl shadow flex justify-between items-center'>
          <div>
            <p className='text-gray-500'>Resolved This Week</p>
            <p className='text-3xl font-bold'>45</p>
          </div>
          <span className='text-green-500 text-3xl'>?</span>
        </div>
      </div>

      <div className='bg-white rounded-xl shadow p-6'>
        <h2 className='text-xl font-semibold mb-4'>Flagged Content</h2>

        <div className='space-y-4'>
          <div className='border rounded-lg p-4'>
            <span className='inline-block bg-red-100 text-red-600 text-sm px-3 py-1 rounded-full mb-2'>
              Inappropriate Language
            </span>
            <p className='text-gray-600 mb-2'>
              “This looks terrible, you should have done it differently.”
            </p>
            <div className='flex justify-end gap-4'>
              <button className='text-gray-500'>Dismiss</button>
              <button className='bg-red-600 text-white px-4 py-2 rounded-lg'>
                Remove Content
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
