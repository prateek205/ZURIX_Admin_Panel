import { useState } from "react";
import { useAdminLoginMutation } from "../../redux/AdminApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [adminLogin, { isLoading: loginLoading, isError: loginError }] =
    useAdminLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await adminLogin({
        email,
        password,
      });

      console.log("LOGIN_DATA:", response);

      navigate("/");

      toast.success("Login Successfull...");
    } catch (error) {
      console.log("LOGIN_ERROR:", error);
      toast.error("Login Failed");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      setEmail(value);
    }

    if (name === "password") {
      setPassword(value);
    }
  };

  return (
    <section className="min-h-screen bg-[#f8f8f6] flex items-center justify-center px-4 py-10 font-zurixFont">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-[0.25em] text-black">
            ZURIX
          </h1>

          <p className="mt-3 text-sm text-gray-500 tracking-wide">
            Admin Panel
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-gray-200 rounded-2xl px-6 py-8 sm:px-10 sm:py-10 shadow-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-medium text-gray-900">Welcome Back</h2>

            <p className="mt-2 text-sm text-gray-500">
              Sign in to manage your ZURIX store.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
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
                placeholder="Enter your email"
                value={email}
                name="email"
                onChange={handleChange}
                required
                className="
                  w-full
                  h-12
                  px-4
                  rounded-lg
                  border border-gray-300
                  bg-white
                  text-sm
                  text-gray-900
                  placeholder:text-gray-400
                  outline-none
                  transition
                  focus:border-black
                  focus:ring-1
                  focus:ring-black
                "
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>

                <button
                  type="button"
                  className="text-xs text-gray-500 hover:text-black transition"
                >
                  Forgot Password?
                </button>
              </div>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                name="password"
                onChange={handleChange}
                required
                className="
                  w-full
                  h-12
                  px-4
                  rounded-lg
                  border border-gray-300
                  bg-white
                  text-sm
                  text-gray-900
                  placeholder:text-gray-400
                  outline-none
                  transition
                  focus:border-black
                  focus:ring-1
                  focus:ring-black
                "
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="
                w-full
                h-12
                rounded-lg
                bg-black
                text-white
                text-sm
                font-medium
                tracking-wide
                transition
                hover:bg-gray-800
                active:scale-[0.99]
              "
            >
              {loginLoading ? "SIGNING IN..." : "SIGN IN"}
            </button>
          </form>

          {/* Bottom Text */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">Authorized personnel only</p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} ZURIX. All rights reserved.
        </p>
      </div>
    </section>
  );
};

export default Login;
