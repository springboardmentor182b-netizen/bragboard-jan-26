import { Link } from "react-router-dom";
import ForgotPasswordForm from "../features/authentication/components/ForgotPasswordForm";

export default function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="w-96 bg-white p-6 rounded shadow">

        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">BragBoard</h1>
          <p className="text-gray-500">
            Reset your password
          </p>
        </div>

        <ForgotPasswordForm />

        <div className="text-center mt-4">
          <Link to="/login" className="text-blue-600 text-sm">
            Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
}
