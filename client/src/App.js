import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminReportModeration from "./pages/AdminReportModeration";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/reports" element={<AdminReportModeration />} />
      </Routes>
    </Router>
  );
}

export default App;