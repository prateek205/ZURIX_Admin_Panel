import React from "react";
import { useAdminLogoutMutation } from "../redux/AdminApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Dashboard = () => {
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
    <section className="flex flex-col gap-5">
      dashboard
      <button
        onClick={handleLogout}
        className="border border-black rounded-md w-[100px] m-left py-1 px-3 bg-red-500"
      >
        Logout
      </button>
    </section>
  );
};

export default Dashboard;
