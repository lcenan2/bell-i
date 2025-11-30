export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src', '<rootDir>/test'],
  testMatch: [
    "**/test/unit/**/*.test.ts"
  ],
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  globalTeardown: "<rootDir>/testTeardown.ts",
  maxWorkers: 1,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    "^.+\\.(css|scss)$": "identity-obj-proxy",
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: true }],
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
};