import React, { useState } from "react";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";

export default function App() {
  const [page, setPage] = useState("login");

  const navigate = (target) => setPage(target);

  const handleLoginSuccess = (role) => {
    if (role === "admin") setPage("admin-dashboard");
    else setPage("employee-dashboard");
  };

  if (page === "signup") return <Signup onNavigate={navigate} />;
  if (page === "forgot") return <ForgotPassword onNavigate={navigate} />;
  if (page === "admin-dashboard") return <h1 style={{color:"white",textAlign:"center",marginTop:"100px"}}>Admin Dashboard (coming soon)</h1>;
  if (page === "employee-dashboard") return <h1 style={{color:"white",textAlign:"center",marginTop:"100px"}}>Employee Dashboard (coming soon)</h1>;
  return <Login onNavigate={navigate} onLoginSuccess={handleLoginSuccess} />;
}