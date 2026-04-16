import React, { useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./Auth.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

export default function GitHubCallback() {
  const { login } = useContext(AuthContext);
  const [status, setStatus] = useState("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const attempted = useRef(false);

  useEffect(() => {
    if (attempted.current) return;
    attempted.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) {
      setErrorMsg("No authorization code found in URL.");
      setStatus("error");
      return;
    }

    (async () => {
      // Retry logic — try up to 2 times
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const res = await fetch(`${API_BASE}/api/auth/github`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
          });
          const data = await res.json();

          if (!res.ok) {
            if (attempt === 1) continue; // silent retry
            throw new Error(data.detail || "GitHub login failed");
          }

          login(
            {
              id: data.user_id,
              email: data.email,
              name: data.name,
              role: data.role,
              department: data.department,
            },
            data.access_token
          );
          window.location.href =
            data.role === "admin" ? "/admin/dashboard" : "/dashboard";
          return;
        } catch (err) {
          if (attempt === 2) {
            setErrorMsg(err.message);
            setStatus("error");
          }
        }
      }
    })();
  }, [login]);

  if (status === "loading") {
    return (
      <div className="auth-wrapper">
        <div className="auth-card" style={{ textAlign: "center" }}>
          <div className="auth-logo">
            <img
              src="https://www.svgrepo.com/show/512317/github-142.svg"
              alt="GitHub"
              width={48}
              style={{ opacity: 0.85 }}
            />
          </div>
          <h1 className="auth-title">BragBoard</h1>
          <p className="auth-subtitle">Signing you in with GitHub…</p>
          <div className="github-spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ textAlign: "center" }}>
        <div className="auth-logo">
          <span className="trophy-icon">⚠️</span>
        </div>
        <h1 className="auth-title">BragBoard</h1>
        <p className="auth-subtitle">GitHub Login Failed</p>
        <div className="auth-error" style={{ marginBottom: "1.5rem" }}>
          {errorMsg}
        </div>
        <button
          className="btn-primary"
          onClick={() => (window.location.href = "/login")}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}