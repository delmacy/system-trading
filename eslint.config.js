import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['dist/**', 'packages/*/dist/**', 'node_modules/**', '**/*.d.ts'],
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: { allowDefaultProject: ["*.js"] },
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error', '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
    },
  },
);
