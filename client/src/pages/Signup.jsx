import { Link } from "react-router-dom";
import SignupForm from "../features/authentication/components/SignupForm";

export default function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="w-96 bg-white p-6 rounded shadow">

        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">BragBoard</h1>
          <p className="text-gray-500">
            Create your account to get started
          </p>
        </div>

        {/* Signup Form */}
        <SignupForm />

        <div className="text-center mt-4">
          <p className="text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-semibold">
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
