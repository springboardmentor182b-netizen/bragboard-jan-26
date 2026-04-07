import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./Auth.css";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [role, setRole] = useState("employee");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Login failed");

      const actualRole = data.role;

      // ✅ Save full user object including id and name
      login({
        id: data.user_id,
        email: data.email,
        name: data.name,
        role: actualRole,
        department: data.department,
      }, data.access_token);

      // ✅ Redirect based on role
      if (actualRole === "admin") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/dashboard";
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="trophy-icon">🏆</span>
        </div>
        <h1 className="auth-title">BragBoard</h1>
        <p className="auth-subtitle">Welcome back! Sign in to your account</p>
        <div className="role-tabs">
          <button
            className={`role-tab ${role === "employee" ? "active" : ""}`}
            onClick={() => setRole("employee")}
            type="button"
          >
            <span>Employee Login</span>
          </button>
          <button
            className={`role-tab ${role === "admin" ? "active" : ""}`}
            onClick={() => setRole("admin")}
            type="button"
          >
            <span>Admin Login</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="forgot-link">
              <span onClick={() => window.location.href = "/forgot-password"}>
                Forgot password?
              </span>
            </div>
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div className="divider"><span>Or continue with</span></div>
        <div className="social-buttons">
          <button className="btn-social">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={20} />
            Google
          </button>
          <button className="btn-social">
            <img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub" width={20} />
            GitHub
          </button>
        </div>
        <p className="auth-switch">
          Don't have an account?{" "}
          <span onClick={() => window.location.href = "/signup"}>Sign up</span>
        </p>
      </div>
    </div>
  );
}