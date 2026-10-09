import React from "react";
import { Route, Routes } from "react-router-dom";
import Auth from "./pages/auth";
import Dashboard from "./pages/dashboard";

const App = () => {
  return (
    <section>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Auth />} />
      </Routes>
    </section>
  );
};

export default App;
