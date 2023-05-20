/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 * Based on: https://github.com/gatsbyjs/gatsby/blob/master/examples/using-wordpress/gatsby-node.js
 */

const { createPages } = require('./create/createPages')
const { createProjects } = require('./create/createProjects')
const nodeExternals = require('webpack-node-externals');

module.exports.createPages = async gatsbyUtilities => {
  await createPages(gatsbyUtilities)
  await createProjects(gatsbyUtilities)
}

const crypto = require("crypto");
global.crypto = {
  ...crypto,
  getRandomValues: (arr) => crypto.randomBytes(arr.length)
}

const webpack = require('webpack')
module.exports.onCreateWebpackConfig = ({
  stage,
  rules,
  loaders,
  plugins,
  actions,
  getConfig,
}) => {
  actions.setWebpackConfig({
    resolve: {
      fallback: {
        crypto: require.resolve('crypto-browserify'),
        assert: require.resolve('assert'),
        util: require.resolve('util'),
        fs: false,
        os: require.resolve('os-browserify/browser'),
        stream: require.resolve('stream-browserify'),
        path: require.resolve('path-browserify'),
        buffer: require.resolve('buffer'),
        process: require.resolve('process'),
        zlib: require.resolve("browserify-zlib"),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify')
      },
    },
    externals: [
      nodeExternals({
        allowlist: ['node:crypto']
      })
    ],
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
      new webpack.ProvidePlugin({
        node: 'node'
      })
    ],
  })

  // Silence 'conflicting order' warning for CSS modules.
  // This is only an issue with regular CSS being imported.
  if (stage === 'build-javascript' || stage === 'develop') {
    const config = getConfig()
    // Get the mini-css-extract-plugin
    const miniCssExtractPlugin = config.plugins.find(
      plugin => plugin.constructor.name === 'MiniCssExtractPlugin'
    )
    // Set the option here to true.
    if (miniCssExtractPlugin) {
      miniCssExtractPlugin.options.ignoreOrder = true
    }
    // Update the config.
    actions.replaceWebpackConfig(config)
  }
}
