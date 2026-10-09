import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/auth";
import Dashboard from "./pages/dashboard";
import AdminLayout from "./layouts/AdminLayout";
import { Slide, ToastContainer } from "react-toastify";
import Products from "./pages/products";
import Category from "./pages/category";
import Order from "./pages/order";
import Customer from "./pages/customer";

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
          <Route path="/products" element={<Products />} />
          <Route path="/categories" element={<Category />} />
          <Route path="/orders" element={<Order />} />
          <Route path="/customers" element={<Customer />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </section>
  );
};

export default App;
