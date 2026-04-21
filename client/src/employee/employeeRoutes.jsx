import { Routes, Route, Navigate } from 'react-router-dom';
import EmployeeLayout from './layout/EmployeeLayout';
import Dashboard from './pages/Dashboard';
import PostShoutout from './pages/PostShoutout';
import Feed from './pages/Feed';
import MyActivity from './pages/MyActivity';
import Leaderboard from './pages/Leaderboard';
import Settings from './pages/Settings';

export default function EmployeeRoutes() {
    return (
        <Routes>
            <Route element={<EmployeeLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="post-shoutout" element={<PostShoutout />} />
                <Route path="feed" element={<Feed />} />
                <Route path="my-shoutouts" element={<MyActivity />} />
                <Route path="leaderboard" element={<Leaderboard />} />
                <Route path="settings" element={<Settings />} />
            </Route>
        </Routes>
    );
}
