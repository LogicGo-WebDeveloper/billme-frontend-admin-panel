import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "../config/route.const";
import { jwtDecode } from "jwt-decode";

const AuthorizePages = () => {
  const token = localStorage.getItem("token");

  let isValid = true;

  if (token) {
    try {
      const { exp } = jwtDecode(token);
      const now = Date.now() / 1000;

      if (exp < now) {
        isValid = false;
        localStorage.removeItem("token");
      }
    } catch (error) {
      isValid = false; 
      localStorage.removeItem("token");
    }
  } else {
    isValid = false;
  }

  return isValid ? <Outlet /> : <Navigate to={ROUTES.ADMIN.LOGIN} replace />;
};

export default AuthorizePages;
