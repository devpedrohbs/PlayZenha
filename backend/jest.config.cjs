/** @type {import('jest').Config} */
module.exports = {
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/../tsconfig.json',
        useESM: true,
        diagnostics: { ignoreCodes: [151002] },
      },
    ],
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: { '^(\\.{1,2}/.*)\\.js$': '$1' },
  setupFiles: ['reflect-metadata'],
  collectCoverageFrom: ['**/*.ts', '!generated/**', '!main.ts'],
  coverageDirectory: '../coverage/unit',
  testEnvironment: 'node',
};
