import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { ROUTES } from "../config/route.const";

const UnAuthorizePages = () => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to={ROUTES.DASHBOARD.HOME} replace />;
  }

  return <Outlet />;
};

export default UnAuthorizePages;
