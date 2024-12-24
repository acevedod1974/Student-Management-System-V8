import { defineConfig } from "vitest/config";
import CustomReporter from "./customReporter.mjs";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    include: [
      // Remove this line if it references the deleted test folder
      // "src/tests/**/*.test.tsx",
    ],
    reporters: [new CustomReporter()],
  },
});
