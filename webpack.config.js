const path = require('path');
const CleanPlugin = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const { EnvironmentPlugin } = require('webpack');
const log = require('webpack-log')({ name: 'wds' });
const pkg = require('./package.json');
const getBugsnagKey = require('./utils/get-bugsnag-key');

// Resolve environment settings for webpack.
const config = f => (
  { development, production } = {
    development: true
  }
) => {
  const env = {
    development: Boolean(development),
    production: Boolean(production),
    version: pkg.version
  };

  log.info(`Environment settings`);
  log.info(env);

  return f(env);
};

module.exports = config(async ({ development, production, version }) => ({
  target: 'web',
  context: path.resolve(__dirname, 'src'),
  entry: {
    ...entry('background'),
    ...entry('common'),
    ...entry('popup'),
    ...entry('settings')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  },
  plugins: [
    new EnvironmentPlugin({
      API_URL: 'https://toggl.com/api',
      BUGSNAG_API_KEY: await getBugsnagKey(),
      DEBUG: development,
      GA_TRACKING_ID: 'UA-3215787-22',
      VERSION: version
    }),
    new CleanPlugin([path.resolve(__dirname, 'dist')]),
    new CopyPlugin([
      ...copy({
        from: 'html/',
        to: 'html/'
      }),
      ...copy({
        from: 'images/',
        to: 'images/'
      }),
      ...copy({
        from: 'scripts/content/',
        to: 'scripts/content/'
      }),
      ...copy({
        from: 'sounds/',
        to: 'sounds/'
      }),
      ...copy({
        from: 'styles/',
        to: 'styles/'
      }),
      {
        from: 'chrome-manifest.json',
        to: 'chrome/manifest.json',
        transform: transformManifest('chrome')
      },
      {
        from: 'firefox-manifest.json',
        to: 'firefox/manifest.json',
        transform: transformManifest('firefox')
      }
    ]),
    production &&
      new FileManagerPlugin({
        onEnd: [
          {
            archive: [
              {
                source: 'dist/chrome',
                destination: `dist/toggl-button-chrome-${version}.zip`
              },
              {
                source: 'dist/firefox',
                destination: `dist/toggl-button-firefox-${version}.zip`
              }
            ]
          },
          {
            delete: ['dist/chrome', 'dist/firefox']
          }
        ]
      })
  ].filter(Boolean)
}));

function entry (name) {
  return {
    [`chrome/scripts/${name}`]: `./scripts/${name}.js`,
    [`firefox/scripts/${name}`]: `./scripts/${name}.js`
  };
}

function copy (o) {
  return [
    {
      ...o,
      to: `chrome/${o.to}`
    },
    {
      ...o,
      to: `firefox/${o.to}`
    }
  ];
}

function transformManifest (browser) {
  return function (content) {
    const manifest = JSON.parse(content.toString());

    if (process.env.TOGGL_API_HOST) {
      manifest.permissions = [
        ...manifest.permissions,
        process.env.TOGGL_API_HOST
      ];
      if (browser === 'chrome') {
        manifest.externally_connectable.matches = [
          ...manifest.externally_connectable.matches,
          process.env.TOGGL_API_HOST
        ];
      }
    }

    manifest.version = pkg.version;

    return Buffer.from(JSON.stringify(manifest, undefined, 2));
  };
}
