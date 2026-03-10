import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminRoutes from './admin/adminRoutes';
import EmployeeRoutes from './employee/employeeRoutes';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/' element={<Navigate to='/dashboard' replace />} />
        <Route path='/admin/*' element={<AdminRoutes />} />
        <Route path='/*' element={<EmployeeRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;
