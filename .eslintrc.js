module.exports = {
  extends: ['standard', 'plugin:react/recommended'],
  plugins: ['react'],
  globals: {
    $$: false,
    $: false
  },
  rules: {
    'semi': [2, 'always'],
    'no-mixed-operators': 'off',
    'no-unused-expressions': 'off',
    'no-var': 'error',
    'one-var': [2, 'never'],
    'prefer-const': 'error',
    'operator-linebreak': [
      'error',
      'after',
      { overrides: { '?': 'before', ':': 'before', '|>': 'before' } }
    ],
    radix: 'error',
    'require-await': 'error'
  },
  env: {
    browser: true
  },
  overrides: [
    {
      files: ['src/scripts/**/*.js'],
      globals: {
        db: false,
        togglbutton: false,
        TogglButton: false,
        chrome: false,
        ga: false
      }
    },
    {
      files: ['src/scripts/content.js'],
      globals: {
        createTag: false
      }
    },
    {
      files: ['src/scripts/common.js'],
      globals: {
        createTag: false
      }
    },
    {
      files: ['src/scripts/popup.js'],
      globals: {
        PopUp: false,
        Db: false,
        chrome: false,
        ga: false
      }
    },
    {
      files: ['src/scripts/popup.js'],
      globals: {
        PopUp: false,
        Db: false
      }
    },
    {
      files: ['src/scripts/content/*.js'],
      globals: {
        togglbutton: false,
        createTag: false
      }
    },

  ]
};
