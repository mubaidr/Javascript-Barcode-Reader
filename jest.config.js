module.exports = {
  automock: false,
  collectCoverage: true,
  collectCoverageFrom: ['./src/**/*.js'],
  coveragePathIgnorePatterns: ['./src-docs/'],
  coverageDirectory: './coverage/',
  // coverageReporters: ['json'],
  // setupFiles: ['jest-canvas-mock'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: { resources: 'usable' },
  // transform: {},
}
