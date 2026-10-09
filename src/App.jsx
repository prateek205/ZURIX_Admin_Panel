import React from "react";
import { Route, Routes } from "react-router-dom";
import Auth from "./pages/auth";
import Dashboard from "./pages/dashboard";
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
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Auth />} />
      </Routes>
    </section>
  );
};

export default App;
