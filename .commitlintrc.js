'use strict'

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['WIP', 'feat', 'fix', 'refactor', 'docs', 'test', 'style', 'chore', 'revert'],
    ],
    'type-case': [1, 'always', ['lower-case', 'upper-case']],
    'scope-case': [0, 'never'],
    'subject-case': [0, 'never'],
    'scope-empty': [0, 'never'],
  },
}
