module.exports = {
  automock: false,
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js'],
  coverageDirectory: './coverage/',
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'html'],
  setupFiles: ['jest-canvas-mock'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: { resources: 'usable' },
  transform: {},
}
