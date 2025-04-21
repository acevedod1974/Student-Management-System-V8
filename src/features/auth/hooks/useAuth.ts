/**
 * Custom hook for authentication logic
 *
 * Provides an interface for authentication-related functionality
 * and navigation after authentication events
 */
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

export const useAuth = () => {
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    login: loginToStore,
    logout: logoutFromStore,
    analyzePasswords,
  } = useAuthStore();

  /**
   * Handle user login with navigation and notifications
   */
  const login = (email: string, password: string) => {
    const success = loginToStore(email, password);

    if (success) {
      toast.success("Login successful");
      navigate("/dashboard");
      return true;
    } else {
      toast.error("Invalid email or password");
      return false;
    }
  };

  /**
   * Handle user logout with navigation
   */
  const logout = () => {
    logoutFromStore();
    navigate("/login");
  };

  /**
   * Determine if the current user has a specific role
   */
  const hasRole = (role: "student" | "teacher") => {
    return user?.role === role;
  };

  /**
   * Determine if the current user has any of the specified roles
   */
  const hasAnyRole = (roles: Array<"student" | "teacher">) => {
    return user ? roles.includes(user.role) : false;
  };

  return {
    user,
    isAuthenticated,
    login,
    logout,
    hasRole,
    hasAnyRole,
    analyzePasswords,
  };
};
