var path = require('path');
var merge = require('webpack-merge');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var WebpackNotifierPlugin = require('webpack-notifier');
var opn = require('opn');
var config = require('./webpack.build.config');
var property = require('lodash/property');

module.exports = merge(config, {
  // Ran upon the initial build. It accepts an array of plugins where each
  // plugin in the array conforms to the webpack plugin API
  // https://github.com/webpack/docs/wiki/How-to-write-a-plugin
  // https://webpack.github.io/docs/plugins.html
  plugins: [
    // The BrowserSyncPlugin acts as a go between for webpack and Browersync.
    // All the same options Browsersync accepts are also accepted here (and
    // some additional webpack configuration). We have configured this so
    // Browersync runs on localhost:3000 and proxies in localhost:8080, which is
    // the webpack dev server. To ensure that Browersync opens to a valid page,
    // we set open to false and have a callback in place that will open up to a
    // valid URL upon webpack completing the development build.
    // https://github.com/Va1/browser-sync-webpack-plugin
    // https://www.browsersync.io/
    // https://www.browsersync.io/docs/options/
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      proxy: 'http://localhost:8080/',
      open: false
    }, {
      callback: function() {
        opn('http://localhost:3000/ns/hamburger-menu-multiple-levels.html')
      }
    }),
    // The WebpackNotifierPlugin displays build status system notifications to the user.
    // The plugin will notify you about the first run (success/fail),
    // all failed runs and the first successful run after recovering from a build failure.
    // In other words: it will stay silent if everything is fine with your build.
    // https://github.com/Turbo87/webpack-notifier
    new WebpackNotifierPlugin({
      title: 'RC Mobile Web',
      alwaysNotify: true
    })
  ],

  // These options are passed along to the webpack dev server which starts upon
  // developing. These options could be set as CLI options, but to keep
  // configuration centralized, it's being defined here.
  // https://webpack.github.io/docs/webpack-dev-server.html
  // https://webpack.github.io/docs/webpack-dev-server.html#webpack-dev-server-cli
  // https://webpack.github.io/docs/webpack-dev-server.html#additional-configuration-options
  devServer: {
    // The location where to start the server from.
    // https://github.com/webpack/docs/wiki/webpack-dev-server#content-base
    contentBase: path.resolve(''),
    // The URL used to access the assets.
    // https://webpack.github.io/docs/configuration.html#output-publicpath
    publicPath: property('output.publicPath')(config)
  }
});
