import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import UserManagement from './pages/UserManagement';
import Dashboard from './pages/Dashboard';
import AdminLayout from './layout/AdminLayout';
import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />

                    {/* Dashboard feed/leaderboard */}
                    <Route path="/dashboard" element={<Dashboard />} />

                    {/* Admin panel */}
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<Navigate to="users" replace />} />
                        <Route path="users" element={<UserManagement />} />
                    </Route>

                    {/* Root redirects */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
