module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    // 'no-console': 'warn',
    // 'simple-import-sort/imports': [
    //   'error',
    //   {
    //     groups: [
    //       // 1. Side effect imports at the start. For me this is important because I want to import reset.css and global styles at the top of my main file.
    //       ['^\\u0000'],
    //       // 2. `react` and packages: Things that start with a letter (or digit or underscore), or `@` followed by a letter.
    //       ['^react$', '^@?\\w'],
    //       // 3. Absolute imports and other imports such as Vue-style `@/foo`.
    //       // Anything not matched in another group. (also relative imports starting with "../")
    //       ['^@', '^'],
    //       // 4. relative imports from same folder "./" (I like to have them grouped together)
    //       ['^\\./'],
    //       // 5. style module imports always come last, this helps to avoid CSS order issues
    //       ['^.+\\.(module.css|module.scss)$'],
    //       // 6. media imports
    //       ['^.+\\.(gif|png|svg|jpg)$'],
    //     ],
    //   },
    // ],
  },
};
