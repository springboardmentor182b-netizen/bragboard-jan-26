import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminPanel from './pages/AdminPanel';
import Sidebar from './components/Sidebar'; // The file we created earlier
import Leaderboard from './pages/Leaderboard';
function App() {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        {/* Sidebar will now stay on the left for all routes */}
        <Sidebar /> 
        
        <div style={{ flex: 1, minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
          <Routes>
            {/* When you finish Home, it will go here */}
            <Route path="/" element={<div>User Home Page (Coming Soon)</div>} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/reports" element={<AdminPanel />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;