// import typescriptEslintEslintPlugin from '@typescript-eslint/eslint-plugin';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ['**/.eslintrc.js'],
  },
  ...compat.extends('plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'),
  {
    files: ['**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      'simple-import-sort': eslintPluginSimpleImportSort,
    },

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },

      parser: tsParser,
      ecmaVersion: 5,
      sourceType: 'module',

      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: '/home/arun/Desktop/nestjs-project',
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },

    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      'no-console': 'warn',
      // 'no-absolute-path': 'error',
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': 'error',
      // ❌ Disallow console.log
      'no-console': ['error', { allow: ['warn', 'error'] }],
      // 'import/first': 'error',
      // 'import/newline-after-import': 'error',
      // 'import/no-duplicates': 'error',

      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            //* 1. Side effect imports at the start. For me this is important because I want to import reset.css and global styles at the top of my main file.
            ['^\\u0000'],
            //* 2. `react` and packages: Things that start with a letter (or digit or underscore), or `@` followed by a letter.
            ['^react$', '^@?\\w'],
            //* 3. Absolute imports and other imports such as Vue-style `@/foo`.
            //* Anything not matched in another group. (also relative imports starting with "../")
            ['^@', '^'],
            //* 4. relative imports from same folder "./" (I like to have them grouped together)
            ['^\\./'],
            //* 5. style module imports always come last, this helps to avoid CSS order issues
            ['^.+\\.(module.css|module.scss)$'],
            //* 6. media imports
            ['^.+\\.(gif|png|svg|jpg)$'],
          ],
        },
      ],
    },
  },
];
