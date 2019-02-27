module.exports = {
  'plugins': [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
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
            'path': 'dist/toggl-button-chrome-*.zip',
            'label': 'Toggl Button for Firefox'
          }
        ]
      }
    ]
  ],
  'tagFormat': '${version}' // eslint-disable-line no-template-curly-in-string
};
