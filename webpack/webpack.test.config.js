var merge = require('webpack-merge');
var config = require('./webpack.common.config');

module.exports = merge(config, {
  // We override the devtool so we can utilize the karma sourcemap preprocessor
  // https://github.com/webpack/karma-webpack#source-maps
  devtool: 'inline-source-map',

  module: {
    // Used to perform transformations based on whether file conditions have
    // been met.
    // https://webpack.github.io/docs/configuration.html#module-loaders
    // https://webpack.github.io/docs/loaders.html
    loaders: [
      // Since our JavaScript is pulling in sass, any importing of scss will be
      // stubbed out. We do this for a couple of reasons:
      //
      // - Sass is not used for testing
      // - By using the sass loader, we increase build times unnecessarily, when
      //   the goal of running our tests is for instant feedback/verification.
      //
      // https://github.com/cherrry/ignore-loader
      {
        test: /\.scss$/,
        loader: 'ignore-loader',
        exclude: /node_modules/
      }
    ],

    // Ran after loaders have been completed. One would utilize this when all
    // the primary loaders have been completed and additional post processing is
    // needed.
    // https://webpack.github.io/docs/configuration.html#module-preloaders-module-postloaders
    // https://webpack.github.io/docs/loaders.html
    postLoaders: [
      // We run the istanbul-instrumenter as a postLoader since we know
      // compilation of all primary loaders have been completed, the source is
      // valid, and the loader won't do any compilation. This loader is
      // responsible for calculating test coverage through Istanbul, which is a
      // JavaScript code coverage tool.
      // https://github.com/deepsweet/istanbul-instrumenter-loader
      // https://github.com/gotwarlost/istanbul
      {
        test: /\.js$/,
        exclude: /(node_modules|test|scripts\/vendor|mobile\/js)/,
        loader: 'istanbul-instrumenter'
      }
    ]
  }
});
