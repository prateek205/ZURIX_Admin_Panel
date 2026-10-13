import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAdminForgotPasswordMutation } from "../../redux/AdminApi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const [adminForgotPassword, { isLoading }] = useAdminForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await adminForgotPassword({
        email: email.trim().toLowerCase(),
      }).unwrap();

      toast.success(response.message);
      setEmail("");
    } catch (error) {
      console.error("FORGOT_PASSWORD_ERROR:", error);
      toast.error(error?.data?.message || "Unable to process your request.");
    }
  };

  return (
    <section className="min-h-screen bg-[#f8f8f6] flex items-center justify-center px-4 py-10 font-zurixFont">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-[0.25em] text-black">
            ZURIX
          </h1>
          <p className="mt-3 text-sm text-gray-500 tracking-wide">
            Admin Panel
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl px-6 py-8 sm:px-10 sm:py-10 shadow-sm">
          <h2 className="text-2xl font-medium text-gray-900">
            Forgot Password?
          </h2>

          <p className="mt-2 mb-8 text-sm text-gray-500">
            Enter your registered admin email to receive a password reset link.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                required
                className="w-full h-12 px-4 rounded-lg border border-gray-300 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-lg bg-black text-white text-sm font-medium transition hover:bg-gray-800 disabled:opacity-60"
            >
              {isLoading ? "SENDING..." : "SEND RESET LINK"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-gray-500 hover:text-black"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
