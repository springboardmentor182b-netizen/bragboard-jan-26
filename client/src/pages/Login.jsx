import { useState } from "react";
import { Link } from "react-router-dom";
import LoginForm from "../features/authentication/components/LoginForm";

export default function Login() {
  const [role, setRole] = useState("employee");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="w-96 bg-white p-6 rounded shadow">

        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">BragBoard</h1>
          <p className="text-gray-500">Welcome back! Sign in to your account</p>
        </div>

        {/* Role Switch */}
        <div className="flex mb-4">
          <button
            onClick={() => setRole("employee")}
            className={`w-1/2 py-2 rounded-l ${role === "employee"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
              }`}
          >
            Employee Login
          </button>

          <button
            onClick={() => setRole("admin")}
            className={`w-1/2 py-2 rounded-r ${role === "admin"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
              }`}
          >
            Admin Login
          </button>
        </div>

        {/* Login Form Component */}
        <LoginForm role={role} />

        <div className="text-right mt-3">
          <Link
            to="/forgot-password"
            className="text-blue-600 text-sm"
          >
            Forgot password?
          </Link>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 font-semibold">
              Sign up
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
