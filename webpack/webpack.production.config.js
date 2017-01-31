var merge = require('webpack-merge');
var webpack = require('webpack');
var config = require('./webpack.build.config');

module.exports = merge(config, {
  // Ran upon the initial build. It accepts an array of plugins where each
  // plugin in the array conforms to the webpack plugin API
  // https://github.com/webpack/docs/wiki/How-to-write-a-plugin
  // https://webpack.github.io/docs/plugins.html
  plugins: [
    // The UglifyJsPlugin is used for minified JavaScript output. This is only
    // ran in production to minimize build time in other environements. We are
    // using the default uglify configuration, but additional configuration can
    // be passed into the UglifyJsPlugin.
    // https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
    // https://github.com/mishoo/UglifyJS2#usage
    new webpack.optimize.UglifyJsPlugin()
  ]
});
