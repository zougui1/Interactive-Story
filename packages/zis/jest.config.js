/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src',
  collectCoverageFrom: [
    '**/*.ts',
    '!**/index.ts',
    '!**/*.d.ts',
  ],
  coverageThreshold: {
    'global': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  coverageDirectory: '../coverage'
};
