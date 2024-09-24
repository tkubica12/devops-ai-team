module.exports = {
    env: {
      browser: true,
      es2021: true,
      jest: true
    },
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      "plugin:@typescript-eslint/recommended"
    ],
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 12,
      sourceType: 'module',
    },
    plugins: [
      'react',
      "@typescript-eslint"
    ],
    rules: {
      // Enable prop-types checking
      'react/prop-types': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  };