const { format } = require("date-fns");

module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  testMatch: ["<rootDir>/src/**/*.test.{ts,tsx}"],
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: "logs",
        outputName: `junit-${new Date().toISOString()}.xml`,
      },
    ],
  ],
};
