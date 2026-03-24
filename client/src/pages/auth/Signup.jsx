import React, { useState } from "react";
import "./Auth.css";

export default function Signup({ onNavigate }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const parseError = (data) => {
    const detail = data?.detail;
    if (!detail) return "Registration failed";
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      return detail
        .map((e) => {
          const field = e.loc?.slice(1).join(" → ") || "";
          const msg = e.msg || "";
          return field ? `${field}: ${msg}` : msg;
        })
        .join(", ");
    }
    return "Registration failed";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          email,
          password,
          department: "General",
          role: adminCode ? "admin" : "employee",
          admin_code: adminCode || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(parseError(data));
      }

      setSuccess("Account created! Redirecting to sign in...");
      setTimeout(() => onNavigate("login"), 1500);
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
        <p className="auth-subtitle">Create your account to get started</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

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
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>
              Admin Code{" "}
              <span style={{ color: "#96a7c4", fontWeight: 400 }}>
                (optional)
              </span>
            </label>
            <input
              type="password"
              placeholder="Enter code if registering as admin"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="divider">
          <span>Or continue with</span>
        </div>

        <div className="social-buttons">
          <button className="btn-social">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              width={20}
            />
            Google
          </button>
          <button className="btn-social">
            <img
              src="https://www.svgrepo.com/show/512317/github-142.svg"
              alt="GitHub"
              width={20}
            />
            GitHub
          </button>
        </div>

        <p className="auth-switch">
          Already have an account?{" "}
          <span onClick={() => onNavigate("login")}>Sign in</span>
        </p>
      </div>
    </div>
  );
}