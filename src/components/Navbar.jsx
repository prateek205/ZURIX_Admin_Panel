import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminLogoutMutation } from "../redux/AdminApi";
import { toast } from "react-toastify";

const Navbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const [adminLogout, { isLoading, isError }] = useAdminLogoutMutation();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await adminLogout().unwrap();

      console.log("LOGOUT_DATA:", response);

      navigate("/login");
      toast.success("Admin Logout Successfully");
    } catch (error) {
      console.log("LOGOUT_ERROR:", error);
      toast.error("Admin Logout Failed");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md font-zurixFont">
      <div className="flex h-[72px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Sidebar Toggle */}
          <button
            type="button"
            aria-label="Toggle sidebar"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-700 transition hover:border-black hover:text-black lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Brand */}
          <div className="flex flex-col">
            <span className="text-xl font-semibold tracking-[0.2em] text-black">
              ZURIX
            </span>
            <span className="mt-0.5 text-[9px] uppercase tracking-[0.22em] text-gray-400">
              Administration
            </span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Status */}
          <div className="hidden items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 sm:flex">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-xs font-medium text-gray-600">
              Admin Workspace
            </span>
          </div>

          {/* Divider */}
          <div className="hidden h-8 w-px bg-gray-200 sm:block" />

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((prev) => !prev)}
              aria-expanded={profileOpen}
              className="flex items-center gap-3 rounded-lg p-1.5 transition hover:bg-gray-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-medium text-white">
                A
              </div>

              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium text-gray-900">
                  Administrator
                </p>
                <p className="mt-0.5 text-xs text-gray-500">Store Manager</p>
              </div>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`hidden text-gray-500 transition sm:block ${
                  profileOpen ? "rotate-180" : ""
                }`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-3 w-52 overflow-hidden rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="text-sm font-medium text-gray-900">
                    Administrator
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Manage your store
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/dashboard");
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 transition hover:bg-gray-50 hover:text-black"
                >
                  Dashboard
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/login");
                    handleLogout;
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-red-600 transition hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
