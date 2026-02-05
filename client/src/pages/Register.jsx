import { useState } from "react";

const Register = () => {
  const [role, setRole] = useState("employee");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log({ role, ...form });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-96"
      >
        <h1 className="text-2xl font-bold text-center mb-4">Sign Up</h1>

        {/* Role switch */}
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setRole("employee")}
            className={flex-1 py-2 rounded ${
              role === "employee" ? "bg-blue-500 text-white" : "bg-gray-200"
            }}
          >
            Employee
          </button>

          <button
            type="button"
            onClick={() => setRole("admin")}
            className={flex-1 py-2 rounded ${
              role === "admin" ? "bg-blue-500 text-white" : "bg-gray-200"
            }}
          >
            Admin
          </button>
        </div>

        <input
          name="name"
          placeholder="Full Name"
          className="w-full p-2 border rounded mb-3"
          onChange={handleChange}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-3"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-3"
          onChange={handleChange}
        />

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          className="w-full p-2 border rounded mb-4"
          onChange={handleChange}
        />

        <button className="w-full bg-blue-500 text-white py-2 rounded mb-3">
          Sign Up
        </button>

        <p className="text-center text-sm">
          Already have an account? <span className="text-blue-500">Login</span>
        </p>
      </form>
    </div>
  );
};

export default Register;
