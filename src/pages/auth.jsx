import React from "react";
import LoginPage from "../components/AdminAuth/LoginPage";
import ProfilePage from "../components/AdminAuth/ProfilePage";

const auth = () => {
  return (
    <section>
      <LoginPage />
      <ProfilePage />
    </section>
  );
};

export default auth;
