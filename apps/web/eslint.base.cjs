/**
 * Local copy of the base ESLint config so Vercel builds (which only upload apps/web)
 * can resolve the shared rules without needing files outside this directory.
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
