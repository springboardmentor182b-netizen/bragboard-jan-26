import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PageContainer from './layout/PageContainer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Feed from './pages/Feed';
import Employees from './pages/Employees';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <PageContainer>
        <Routes>
          <Route path="/"                  element={<Home />}      />
          <Route path="/dashboard/:userId" element={<Dashboard />} />
          <Route path="/feed"              element={<Feed />}      />
          <Route path="/employees"         element={<Employees />} />
          <Route path="/admin"             element={<AdminPanel />} />
          <Route path="/login"             element={<Login />}     />
          <Route path="*"                  element={<Navigate to="/" replace />} />
        </Routes>
      </PageContainer>
    </Router>
  );
}

export default App;
