import { useState } from "react";
import { forgotPassword } from "../services/forgotPassword";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await forgotPassword(email);
    alert("Reset link sent (check console)");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        placeholder="Enter your email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="btn-primary w-full">Send Reset Link</button>
    </form>
  );
}
