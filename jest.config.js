module.exports = {
  automock: false,
  bail: false,
  verbose: true,
  collectCoverage: true,
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'html'],
  coverageDirectory: './coverage/',
  collectCoverageFrom: ['src/**/*.js'],
  transform: {},
}
