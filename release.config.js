module.exports = {
  'plugins': [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/changelog',
      {
        'changelogFile': 'docs/_includes/changelog.md'
      }
    ],
    '@semantic-release/npm',
    [
      '@semantic-release/github',
      {
        'assets': [
          {
            'path': 'dist/toggl-button-chrome-*.zip',
            'label': 'Toggl Button for Chrome'
          },
          {
            'path': 'dist/toggl-button-firefox-*.zip',
            'label': 'Toggl Button for Firefox'
          }
        ]
      }
    ],
    [
      '@semantic-release/git',
      {
        'assets': [
          'docs/_includes/changelog.md',
          'package.json'
        ]
      }
    ]
  ],
  'tagFormat': '${version}' // eslint-disable-line no-template-curly-in-string
};
