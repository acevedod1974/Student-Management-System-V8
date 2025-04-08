import {
  SecurityMiddleware,
  securityHeaders,
  applySecurityHeaders,
} from "./security";

describe("SecurityMiddleware", () => {
  let security: SecurityMiddleware;

  beforeEach(() => {
    security = SecurityMiddleware.getInstance();
  });

  describe("sanitizeRequestData", () => {
    it("sanitizes string values", () => {
      const input = {
        name: '<script>alert("xss")</script>Hello',
        description: 'javascript:alert("xss")',
        onclick: 'onclick=alert("xss")',
      };

      const sanitized = security.sanitizeRequestData(input);

      expect(sanitized).toEqual({
        name: "Hello",
        description: 'alert("xss")',
        onclick: 'alert("xss")',
      });
    });

    it("sanitizes nested objects", () => {
      const input = {
        user: {
          name: '<script>alert("xss")</script>John',
          profile: {
            bio: 'javascript:alert("xss")',
          },
        },
      };

      const sanitized = security.sanitizeRequestData(input);

      expect(sanitized).toEqual({
        user: {
          name: "John",
          profile: {
            bio: 'alert("xss")',
          },
        },
      });
    });

    it("sanitizes arrays", () => {
      const input = {
        tags: ['<script>alert("xss")</script>tag1', "normal-tag"],
      };

      const sanitized = security.sanitizeRequestData(input);

      expect(sanitized).toEqual({
        tags: ["tag1", "normal-tag"],
      });
    });

    it("preserves non-string values", () => {
      const input = {
        name: '<script>alert("xss")</script>John',
        age: 25,
        active: true,
        score: null,
      };

      const sanitized = security.sanitizeRequestData(input);

      expect(sanitized).toEqual({
        name: "John",
        age: 25,
        active: true,
        score: null,
      });
    });
  });

  describe("rate limiting", () => {
    beforeEach(() => {
      // Reset rate limiter before each test
      security.resetRateLimit("test-user");
    });

    it("allows requests within rate limit", () => {
      const results = Array(5)
        .fill(null)
        .map(() => security.checkRateLimit("test-user"));

      expect(results.every((result) => result === true)).toBe(true);
    });
  });
});

describe("security headers", () => {
  it("contains all required security headers", () => {
    expect(securityHeaders).toHaveProperty("Content-Security-Policy");
    expect(securityHeaders).toHaveProperty("X-Content-Type-Options");
    expect(securityHeaders).toHaveProperty("X-Frame-Options");
    expect(securityHeaders).toHaveProperty("X-XSS-Protection");
    expect(securityHeaders).toHaveProperty("Referrer-Policy");
    expect(securityHeaders).toHaveProperty("Permissions-Policy");
  });

  it("applies security headers to document", () => {
    document.head.innerHTML = "";
    applySecurityHeaders();

    const metas = document.head.getElementsByTagName("meta");
    expect(metas.length).toBe(Object.keys(securityHeaders).length);

    Object.entries(securityHeaders).forEach(([header, value]) => {
      const meta = Array.from(metas).find((m) => m.httpEquiv === header);
      expect(meta).toBeTruthy();
      expect(meta?.content).toBe(value);
    });
  });
});
