/**
 * Private Route Component
 *
 * A route wrapper that ensures users are authenticated and have the required role(s)
 * to access protected routes
 */
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<"student" | "teacher">;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  allowedRoles = ["teacher", "student"],
}) => {
  const { isAuthenticated, hasAnyRole } = useAuth();
  const location = useLocation();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to home if authenticated but without required role
  if (!hasAnyRole(allowedRoles)) {
    return <Navigate to="/" replace />;
  }

  // Render children if authenticated and has required role
  return <>{children}</>;
};

export default PrivateRoute;
