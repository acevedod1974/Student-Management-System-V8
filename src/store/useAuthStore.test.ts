import { act, renderHook } from "@testing-library/react";
import { useAuthStore } from "./useAuthStore";
import { supabase } from "../utils/supabaseClient";
import { SecurityMiddleware } from "../middleware/security";

jest.mock("../utils/supabaseClient", () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn(),
      updateUser: jest.fn(),
    },
  },
}));

describe("useAuthStore", () => {
  const security = SecurityMiddleware.getInstance();
  const mockUser = { id: "1", email: "test@example.com" };

  beforeEach(() => {
    jest.clearAllMocks();
    security.resetRateLimit("auth:test@example.com");
  });

  describe("login", () => {
    it("successfully logs in user", async () => {
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.login("test@example.com", "password");
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.error).toBeNull();
    });

    it("handles rate limiting", async () => {
      // Make multiple login attempts
      const { result } = renderHook(() => useAuthStore());

      // Simulate hitting rate limit
      for (let i = 0; i < 6; i++) {
        try {
          await act(async () => {
            await result.current.login("test@example.com", "password");
          });
        } catch (error) {
          if (i === 5) {
            expect(error).toEqual(
              new Error("Too many login attempts. Please try again later.")
            );
          }
        }
      }
    });

    it("sanitizes email input", async () => {
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.login(
          "<script>test@example.com</script>",
          "password"
        );
      });

      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password",
      });
    });
  });

  describe("changePassword", () => {
    it("successfully changes password", async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      (supabase.auth.updateUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.changePassword("oldpassword", "newpassword");
      });

      expect(result.current.error).toBeNull();
      expect(supabase.auth.updateUser).toHaveBeenCalledWith({
        password: "newpassword",
      });
    });

    it("verifies old password before changing", async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: null,
        error: new Error("Invalid credentials"),
      });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        try {
          await result.current.changePassword("wrongpassword", "newpassword");
        } catch (error) {
          expect(error).toEqual(new Error("Current password is incorrect"));
        }
      });

      expect(supabase.auth.updateUser).not.toHaveBeenCalled();
    });
  });

  describe("logout", () => {
    it("successfully logs out user", async () => {
      (supabase.auth.signOut as jest.Mock).mockResolvedValue({
        error: null,
      });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.error).toBeNull();
    });
  });
});
