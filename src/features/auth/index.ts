/**
 * Authentication Feature Public API
 *
 * Exports all components, hooks and types for the auth feature
 */

// Components
export { default as LoginPage } from "./components/LoginPage";

// Hooks
export { useAuth } from "./hooks/useAuth";

// Types
export type { User, AuthState, AuthStore } from "./types";

// Store (exported for direct use when needed)
export { useAuthStore } from "./store/authStore";
