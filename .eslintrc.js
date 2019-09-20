module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 8,
  },
  env: {
    es6: true,
    browser: true,
    node: true,
    jest: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  globals: {},
  rules: {
    semi: 0,
    'linebreak-style': 0,
    // allow debugger during development
    'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
  },
}
