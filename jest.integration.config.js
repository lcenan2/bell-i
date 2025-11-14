export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  testMatch: ["**/test/integration/**/*.test.ts"],
  setupFilesAfterEnv: ["<rootDir>/test/integration/setupIntegrationTests.ts"],
};