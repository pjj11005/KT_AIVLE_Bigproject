module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',

  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'no-console': 1,
    'no-unused-vars': 1,
    'prettier/prettier': 1,
    semi: 'error',
  },
};
