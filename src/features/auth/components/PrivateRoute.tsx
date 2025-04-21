/**
 * PrivateRoute Component - Route protection based on authentication status and user role
 */
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("student" | "teacher")[];
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  allowedRoles = ["teacher", "student"],
}) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated but doesn't have required role, redirect to home
  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // If all checks pass, render the children
  return <>{children}</>;
};
