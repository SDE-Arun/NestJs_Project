// feat: addition of some new features
// add: changes to add new capability or function
// cut: removing a capability or function
// fix: a bug fix
// bump: increasing the versions or dependency versions
// build: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
// make: changes to the build process, tooling or infra
// ci: changes to CI configuration files and scripts
// docs: changes to the documentation
// test: adding missing tests or correcting existing tests
// chore: changes for housekeeping (avoiding this will. Force more meaningful message)
// refactor: a code change that neither fixes a bug nor adds a feature
// style: changes to the code that do not affect the meaning
// perf: a code change that improves performance
// revert: reverting an accidental commit

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [2, 'always', 100],
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 100],
    'header-max-length': [2, 'always', 100],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'add',
        'build',
        'bump',
        'chore',
        'ci',
        'cut',
        'docs',
        'feat',
        'fix',
        'make',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
        'translation',
        'security',
        'changeset',
      ],
    ],
  },
};
