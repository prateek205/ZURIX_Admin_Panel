import React from "react";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-[#f8f8f6] font-zurixFont">
      {/* Navbar will be added here */}

      <div className="flex min-h-screen">
        {/* Sidebar will be added here */}

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
