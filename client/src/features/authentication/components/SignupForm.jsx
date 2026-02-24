import { useState } from "react";
import { signupUser } from "../services/signup";

export default function SignupForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
    department: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signupUser(form);
    alert("Account Created");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input placeholder="Full Name" onChange={(e)=>setForm({...form,name:e.target.value})}/>
      <input placeholder="Email" onChange={(e)=>setForm({...form,email:e.target.value})}/>
      <input type="password" placeholder="Password"
        onChange={(e)=>setForm({...form,password:e.target.value})}/>
      <input placeholder="Department"
        onChange={(e)=>setForm({...form,department:e.target.value})}/>
      <button className="btn-primary w-full">Create Account</button>
    </form>
  );
}
