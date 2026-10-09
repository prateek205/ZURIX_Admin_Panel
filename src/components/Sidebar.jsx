import React from "react";
import { NavLink } from "react-router-dom";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    name: "Products",
    path: "/products",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
        <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
      </svg>
    ),
  },
  {
    name: "Categories",
    path: "/categories",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <rect x="3" y="3" width="8" height="8" rx="1" />
        <rect x="13" y="3" width="8" height="8" rx="1" />
        <rect x="3" y="13" width="8" height="8" rx="1" />
        <rect x="13" y="13" width="8" height="8" rx="1" />
      </svg>
    ),
  },
  {
    name: "Orders",
    path: "/orders",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <path d="M6 3h12l3 4v14H3V7l3-4Z" />
        <path d="M3 7h18M9 11h6" />
      </svg>
    ),
  },
  {
    name: "Customers",
    path: "/customers",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <circle cx="9" cy="8" r="4" />
        <path d="M2 21v-2a7 7 0 0 1 14 0v2M17 4.5a4 4 0 0 1 0 7.5M19 14a6 6 0 0 1 3 5v2" />
      </svg>
    ),
  },
  {
    name: "Coupons",
    path: "/coupons",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <path d="M3 8V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a3 3 0 0 0 0 6v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a3 3 0 0 0 0-6Z" />
        <path d="M12 7v2m0 3v2m0 3v1" />
      </svg>
    ),
  },
  {
    name: "Inventory",
    path: "/inventory",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <path d="M4 7 12 3l8 4v10l-8 4-8-4V7Z" />
        <path d="m4 7 8 4 8-4M12 11v10M8 5l8 4" />
      </svg>
    ),
  },
  {
    name: "Reports",
    path: "/reports",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <path d="M4 20V10m5 10V4m6 16v-7m5 7V7" />
      </svg>
    ),
  },
];

const Sidebar = () => {
  return (
    <aside className="flex h-[calc(100vh-72px)] w-64 shrink-0 flex-col border-r border-gray-200 bg-white font-zurixFont">
      {/* Sidebar Heading */}
      <div className="border-b border-gray-100 px-6 py-6">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-gray-400">
          Workspace
        </p>
        <h2 className="mt-2 text-sm font-semibold text-gray-900">
          Store Management
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5">
        <p className="mb-3 px-3 text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400">
          Main Menu
        </p>

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-all duration-200 ${
                isActive
                  ? "bg-black font-medium text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-black"
              }`
            }
          >
            <span className="h-[19px] w-[19px] shrink-0">
              {React.cloneElement(item.icon, {
                className: "h-full w-full",
              })}
            </span>

            <span>{item.name}</span>

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="ml-auto h-4 w-4 opacity-0 transition group-hover:opacity-100"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-gray-100 p-4">
        <div className="rounded-xl bg-[#f8f8f6] p-4">
          <p className="text-xs font-semibold tracking-wide text-gray-900">
            ZURIX ADMIN
          </p>
          <p className="mt-1 text-xs leading-5 text-gray-500">
            Manage your store from one place.
          </p>
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-gray-200">
            <div className="h-full w-full rounded-full bg-black" />
          </div>
          <p className="mt-2 text-[10px] text-gray-400">Store workspace</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
