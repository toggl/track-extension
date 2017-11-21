const path = require('path')
const HtmlPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const CleanPlugin = require('clean-webpack-plugin')

const DIR_OUTPUT = path.resolve(__dirname, 'dist')

module.exports = (env = {}) => {
  // 'chrome' or 'firefox'
  const browser = env.browser !== 'firefox' ? 'ch' : 'ff'

  return {
    entry: {
      background: './src/background.js',
      popup: './src/popup.jsx',
      settings: './src/settings.jsx'
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json']
    },
    output: {
      filename: '[name].bundle.js',
      path: DIR_OUTPUT
    },
    plugins: [
      new CleanPlugin([DIR_OUTPUT]),
      new HtmlPlugin({
        filename: 'html/popup.html',
        title: 'Toggl Button',
        template: './src/template.html',
        chunks: ['popup']
      }),
      new HtmlPlugin({
        filename: 'html/settings.html',
        title: 'Toggl Button - Settings',
        template: './src/template.html',
        chunks: ['settings']
      }),
      new CopyPlugin([
        { from: `./src/manifest_${browser}.json`, to: 'manifest.json' },
        { from: './src/images/*', to: 'images', flatten: true }
      ])
    ]
  }
}
