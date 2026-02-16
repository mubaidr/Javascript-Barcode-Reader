module.exports = {
  collectCoverageFrom: ['src/**/*.{js,ts}'],
  coveragePathIgnorePatterns: ['/node_modules/', '/test/', '/dist/', '/docs/', '/tools/'],
  moduleFileExtensions: ['ts', 'js'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    resources: 'usable',
  },
  testPathIgnorePatterns: ['/node_modules/', '/src/', '/dist/', '/docs/', '/tools/'],
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
  transform: {
    '.(ts|tsx)': 'ts-jest',
  },
  testTimeout: 30000,
}
