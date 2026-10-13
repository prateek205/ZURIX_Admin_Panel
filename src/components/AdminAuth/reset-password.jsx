import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAdminResetPasswordMutation } from "../../redux/AdminApi";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [adminResetPassword, { isLoading }] =
    useAdminResetPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Reset token is missing. Request a new reset link.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const response = await adminResetPassword({
        token,
        password,
        confirmPassword,
      }).unwrap();

      toast.success(
        response.message || "Password reset successfully!",
      );

      setPassword("");
      setConfirmPassword("");

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("ADMIN_RESET_PASSWORD_ERROR:", error);

      toast.error(
        error?.data?.message ||
          "Unable to reset password. Request a new link if it has expired.",
      );
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
            Reset Password
          </h2>

          <p className="mt-2 mb-8 text-sm text-gray-500">
            Enter your new password below.
          </p>

          {!token ? (
            <div>
              <p className="text-sm text-red-600 mb-5">
                The reset token is missing. Please request a new reset link.
              </p>

              <Link
                to="/forgot-password"
                className="block text-center w-full rounded-lg bg-black text-white py-3 text-sm hover:bg-gray-800"
              >
                Request New Reset Link
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  New Password
                </label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  minLength={8}
                  autoComplete="new-password"
                  required
                  className="w-full h-12 px-4 rounded-lg border border-gray-300 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirm New Password
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  minLength={8}
                  autoComplete="new-password"
                  required
                  className="w-full h-12 px-4 rounded-lg border border-gray-300 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-lg bg-black text-white text-sm font-medium transition hover:bg-gray-800 disabled:opacity-60"
              >
                {isLoading ? "RESETTING..." : "RESET PASSWORD"}
              </button>
            </form>
          )}

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

export default ResetPassword;