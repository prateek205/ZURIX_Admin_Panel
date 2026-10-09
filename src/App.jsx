import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/auth";
import Dashboard from "./pages/Dashboard";
import AdminLayout from "./layouts/AdminLayout";
import { Slide, ToastContainer } from "react-toastify";

const App = () => {
  return (
    <section>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Slide}
      />

      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </section>
  );
};

export default App;
