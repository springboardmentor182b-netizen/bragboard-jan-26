import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/forgotpassword';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import Dashboard from './pages/Dashboard';
import AdminLayout from './layout/AdminLayout';
import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Auth pages (main-group-D versions with security questions) */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />

                    {/* Dashboard feed/leaderboard */}
                    <Route path="/dashboard" element={<Dashboard />} />

                    {/* Admin dashboard (standalone with built-in sidebar) */}
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />

                    {/* Admin panel (layout-based) */}
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<Navigate to="users" replace />} />
                        <Route path="users" element={<UserManagement />} />
                    </Route>

                    {/* Convenience redirects */}
                    <Route path="/usermanagement" element={<Navigate to="/admin/users" replace />} />
                    <Route path="/signin" element={<Navigate to="/login" replace />} />
                    <Route path="/signup" element={<Navigate to="/register" replace />} />

                    {/* Root redirect */}
                    <Route path="/" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
