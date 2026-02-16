import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className='flex min-h-screen'>
      <Sidebar />
      <main className='flex-1 p-8'>
        <Outlet />
      </main>
    </div>
  );
}
