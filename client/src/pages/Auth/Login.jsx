import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import "./Auth.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

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
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Login failed");
      const actualRole = data.role;
      login({
        id: data.user_id,
        email: data.email,
        name: data.name,
        role: actualRole,
        department: data.department,
      }, data.access_token);
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

  // ── Google OAuth ──────────────────────────────────────────────────────────
  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Google login failed");
      login({
        id: data.user_id,
        email: data.email,
        name: data.name,
        role: data.role,
        department: data.department,
      }, data.access_token);
      window.location.href = data.role === "admin" ? "/admin/dashboard" : "/dashboard";
    } catch (err) {
      setError(err.message);
    }
  };

  // ── GitHub OAuth ──────────────────────────────────────────────────────────
  const handleGitHubLogin = () => {
    const clientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/github/callback`;
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email`;
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
          {/* Google Login Button */}
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google login failed")}
            useOneTap={false}
            text="signin_with"
            shape="rectangular"
            width="100%"
          />

          {/* GitHub Login Button */}
          <button className="btn-social" onClick={handleGitHubLogin} type="button">
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