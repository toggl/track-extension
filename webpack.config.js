const path = require('path');
const CleanPlugin = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const { DefinePlugin } = require('webpack');
const log = require('webpack-log')({ name: 'wds' });
const pkg = require('./package.json');

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

module.exports = config(({ development, production, version }) => ({
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
    new DefinePlugin({
      'process.env': stringifyValues({
        API_URL: 'https://toggl.com/api',
        BUGSNAG_API_KEY: '7419717b29de539ab0fbe35dcd7ca19d',
        DEBUG: development,
        GA_TRACKING_ID: 'UA-3215787-22',
        VERSION: version
      })
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
        transform: addVersion
      },
      {
        from: 'firefox-manifest.json',
        to: 'firefox/manifest.json',
        transform: addVersion
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

function entry(name) {
  return {
    [`chrome/scripts/${name}`]: `./scripts/${name}.js`,
    [`firefox/scripts/${name}`]: `./scripts/${name}.js`
  };
}

function copy(o) {
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

function stringifyValues(obj) {
  return Object.entries(obj)
    .map(([k, v]) => [k, JSON.stringify(v)])
    .reduce((o, [k, v]) => {
      o[k] = v;
      return o;
    }, {});
}

function addVersion(content) {
  return Buffer.from(
    JSON.stringify(
      {
        version: pkg.version,
        ...JSON.parse(content.toString())
      },
      undefined,
      2
    )
  );
}
