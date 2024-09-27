module.exports = {
  extends: [
    'react-app',
    'react-app/jest',
    'plugin:react/recommended'
  ],
  rules: {
    'react/prop-types': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint'],
};
