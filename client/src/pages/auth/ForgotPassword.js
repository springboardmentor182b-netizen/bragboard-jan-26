import React, { useState } from "react";
import "./Auth.css";

export default function ForgotPassword({ onNavigate }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
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

        {!submitted ? (
          <>
            <p className="auth-subtitle">
              Enter your email and we'll send you a reset link
            </p>
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
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </>
        ) : (
          <div className="success-state">
            <div className="success-icon">✉️</div>
            <h2>Check your email</h2>
            <p>
              We've sent a password reset link to <strong>{email}</strong>.
              Check your inbox and follow the instructions.
            </p>
          </div>
        )}

        <p className="auth-switch">
          Remember your password?{" "}
          <span onClick={() => onNavigate("login")}>Back to Sign In</span>
        </p>
      </div>
    </div>
  );
}