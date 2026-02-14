/**
 * Base ESLint config shared across Green Shillings packages.
 * Individual apps extend this file to add framework-specific rules.
 */
module.exports = {
  root: true,
  reportUnusedDisableDirectives: true,
  ignorePatterns: ['node_modules', 'dist', 'build', '.next'],
  env: {
    es2022: true,
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  extends: ['eslint:recommended', 'prettier'],
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: false,
        ecmaFeatures: {
          jsx: true,
        },
      },
      plugins: ['@typescript-eslint'],
      extends: ['plugin:@typescript-eslint/recommended'],
    },
  ],
};
