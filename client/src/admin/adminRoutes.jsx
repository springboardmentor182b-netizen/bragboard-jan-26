import { Routes, Route } from 'react-router-dom';
import AdminLayout from './layout/AdminLayout';

import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import ShoutoutManagement from './pages/ShoutoutManagement';
import Reports from './pages/Reports';
import UserActivity from './pages/UserActivity';
import Moderation from './pages/Moderation';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path='users' element={<UserManagement />} />
        <Route path='shoutouts' element={<ShoutoutManagement />} />
        <Route path='reports' element={<Reports />} />
        <Route path='activity' element={<UserActivity />} />
        <Route path='moderation' element={<Moderation />} />
      </Route>
    </Routes>
  );
}
