import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'coverage/**',
    'node_modules/**',
    '.emulator-data/**',
    'next-env.d.ts',
  ]),
  {
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    // Security boundary: the Admin SDK may only be imported by the single server-only
    // module that initialises it (and by CLI scripts). Everything else goes through it.
    files: ['**/*.{ts,tsx}'],
    ignores: ['src/lib/firebase/admin.ts', 'scripts/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['firebase-admin', 'firebase-admin/*'],
              message:
                'Import Admin SDK instances from "@/lib/firebase/admin" (server-only) instead.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['scripts/**/*.ts'],
    rules: { 'no-console': 'off' },
  },
]);
