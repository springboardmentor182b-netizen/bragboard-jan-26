import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import './index.css';

function App() {
  // In real app, check if user is authenticated
  const isAuthenticated = true; // For now, set to true for testing

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/admin/*" 
          element={isAuthenticated ? <AdminPanel /> : <Navigate to="/login" />} 
        />
        <Route path="/" element={<Navigate to="/admin" />} />
      </Routes>
    </Router>
  );
}

export default App;
