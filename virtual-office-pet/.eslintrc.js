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
      'react/prop-types': 'off', // This line disables prop-types checking
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  };