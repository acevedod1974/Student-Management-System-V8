import DOMPurify from "dompurify";

export const validatePassword = (
  password: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input.trim());
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const rateLimiter = (() => {
  const attempts = new Map<string, { count: number; lastAttempt: number }>();
  const MAX_ATTEMPTS = 5;
  const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

  return {
    checkLimit: (identifier: string): boolean => {
      const now = Date.now();
      const userAttempts = attempts.get(identifier);

      if (!userAttempts) {
        attempts.set(identifier, { count: 1, lastAttempt: now });
        return true;
      }

      if (now - userAttempts.lastAttempt > WINDOW_MS) {
        attempts.set(identifier, { count: 1, lastAttempt: now });
        return true;
      }

      if (userAttempts.count >= MAX_ATTEMPTS) {
        return false;
      }

      attempts.set(identifier, {
        count: userAttempts.count + 1,
        lastAttempt: now,
      });
      return true;
    },

    resetLimit: (identifier: string): void => {
      attempts.delete(identifier);
    },
  };
})();
