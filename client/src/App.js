import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminRoutes from './admin/adminRoutes';

import EmployeeRoutes from './employee/employeeRoutes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to='/dashboard' replace />} />
        <Route path='/admin/*' element={<AdminRoutes />} />
        <Route path='/*' element={<EmployeeRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;
