<<<<<<< HEAD
import AdminDashboard from "./features/admin/AdminDashboard";

function App() {
  return <AdminDashboard />;
}

export default App;
=======
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard/*" element={<Dashboard />} />
            </Routes>
        </Router>
    );
}

export default App;
>>>>>>> 79e11ad (Employee Dashboard)
