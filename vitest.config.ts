import { defineConfig } from "vitest/config";

export default defineConfig({
  server: {
    allowedHosts: true
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    include: [
      // Remove this line if it references the deleted test folder
      // "src/tests/**/*.test.tsx",
    ],
  },
});
