import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminReportModeration from "./pages/AdminReportModeration";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/reports" element={<AdminReportModeration />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
