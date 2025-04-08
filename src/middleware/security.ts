import { rateLimiter } from "../utils/validation";

export const securityHeaders = {
  "Content-Security-Policy":
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://*.supabase.co",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

export function applySecurityHeaders(): void {
  Object.entries(securityHeaders).forEach(([header, value]) => {
    if (document.head) {
      const meta = document.createElement("meta");
      meta.httpEquiv = header;
      meta.content = value;
      document.head.appendChild(meta);
    }
  });
}

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
}

export class SecurityMiddleware {
  private static instance: SecurityMiddleware;
  private defaultRateLimit: RateLimitConfig = {
    maxAttempts: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
  };

  private constructor() {
    // Private constructor to force singleton pattern
  }

  static getInstance(): SecurityMiddleware {
    if (!SecurityMiddleware.instance) {
      SecurityMiddleware.instance = new SecurityMiddleware();
    }
    return SecurityMiddleware.instance;
  }

  checkRateLimit(identifier: string): boolean {
    return rateLimiter.checkLimit(identifier);
  }

  resetRateLimit(identifier: string): void {
    rateLimiter.resetLimit(identifier);
  }

  sanitizeRequestData<T extends object>(data: T): T {
    const sanitized: Record<string, unknown> = {};

    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === "string") {
        sanitized[key] = this.sanitizeString(value);
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map((item) =>
          typeof item === "string" ? this.sanitizeString(item) : item
        );
      } else if (value && typeof value === "object") {
        sanitized[key] = this.sanitizeRequestData(value);
      } else {
        sanitized[key] = value;
      }
    });

    return sanitized;
  }

  private sanitizeString(input: string): string {
    // Remove potentially dangerous characters and patterns
    return input
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .replace(/javascript:/gi, "") // Remove javascript: protocol
      .replace(/data:/gi, "") // Remove data: protocol
      .replace(/\b(on\w+)=/gi, "") // Remove event handlers
      .trim();
  }
}
