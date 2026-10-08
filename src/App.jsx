import React from "react";
import { Route, Router } from "react-router-dom";
import Auth from "./pages/auth";

const App = () => {
  return (
    <section>
      <Router>
        <Route path="/login" element={<Auth />} />
      </Router>
    </section>
  );
};

export default App;
