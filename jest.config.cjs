const { format } = require("date-fns");

module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  testMatch: [
    // Remove these lines if they reference the deleted test folder
    // "<rootDir>/src/tests/**/*.test.tsx",
    // "<rootDir>/src/tests/**/*.test.ts",
  ],
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: "logs",
        outputName: `junit-${format(new Date(), "yyyy-MM-dd-HH-mm-ss")}.xml`,
      },
    ],
  ],
};
