import { useState } from "react";

const Login = () => {
  const [role, setRole] = useState("employee");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ role, email, password });
  };

  // ✅ Social login handlers
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8000/auth/google/login";
  };

  const handleGithubLogin = () => {
    window.location.href = "http://localhost:8000/auth/github/login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-96"
      >
        <h1 className="text-2xl font-bold text-center mb-2">BragBoard</h1>
        <p className="text-center text-gray-500 mb-6">
          Welcome back – Sign in to your account
        </p>

        {/* Role Switch */}
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setRole("employee")}
            className={`flex-1 py-2 rounded ${
              role === "employee" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Employee Login
          </button>

          <button
            type="button"
            onClick={() => setRole("admin")}
            className={`flex-1 py-2 rounded ${
              role === "admin" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Admin Login
          </button>
        </div>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-3"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-2"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <p className="text-sm text-right text-blue-500 cursor-pointer mb-4">
          Forgot password?
        </p>

        <button className="w-full bg-blue-500 text-white py-2 rounded mb-4">
          Sign In
        </button>

        <p className="text-center text-sm mb-3">
          Don’t have an account?{" "}
          <span className="text-blue-500 cursor-pointer">Sign up</span>
        </p>

        {/* Social login */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex-1 border py-2 rounded"
          >
            Google
          </button>

          <button
            type="button"
            onClick={handleGithubLogin}
            className="flex-1 border py-2 rounded"
          >
            GitHub
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
