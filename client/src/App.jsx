import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ForgotPassword from './pages/ForgotPassword';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

// Admin-Only Route Component
function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" />;  // Redirect non-admins to employee dashboard
  }
  
  return children;
}

// Public Route Component (redirects to appropriate dashboard if already logged in)
function PublicRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated()) {
    return children;
  }
  
  // Redirect based on user role
  return user?.role === 'admin' ? <Navigate to="/admin-dashboard" /> : <Navigate to="/dashboard" />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } 
      />
      
      <Route 
        path="/forgot-password" 
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        } 
      />
      
      {/* Employee Dashboard */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Admin Dashboard - Only accessible by admins */}
      <Route 
        path="/admin-dashboard" 
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } 
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;