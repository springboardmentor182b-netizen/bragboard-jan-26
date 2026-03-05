import { useState } from "react";
import { loginUser } from "../services/login";

export default function LoginForm({ role }) {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await loginUser({ ...form, role });
    localStorage.setItem("access_token", res.data.access_token);
    alert("Login Successful");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        className="input"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        className="input"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button className="btn-primary w-full">Sign In</button>
    </form>
  );
}
