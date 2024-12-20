import { defineConfig } from "vitest/config";
import CustomReporter from "./customReporter";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    include: ["src/tests/**/*.test.tsx"],
    reporters: [new CustomReporter()],
  },
});
