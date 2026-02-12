import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import UserManagement from './pages/UserManagement';
import AdminLayout from './layout/AdminLayout';
import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />

                    {/* Admin panel */}
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<Navigate to="users" replace />} />
                        <Route path="users" element={<UserManagement />} />
                    </Route>

                    <Route path="/" element={<Navigate to="/signin" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
