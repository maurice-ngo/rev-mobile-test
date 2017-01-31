var path = require('path');
var join = path.join;
var HappyPack = require('happypack');
var helpers = require('./webpack-helpers');

module.exports = {
  // In this case, contains a number of files that will be bundled upon
  // building. Entry can come in different forms, i.e. a string, an array, or an
  // object. In our case, we are defining multiple entry points, so we are using
  // an object.
  // https://webpack.github.io/docs/configuration.html#entry
  // https://webpack.github.io/docs/multiple-entry-points.html
  entry: {
    chrome: helpers.entryPoint('chrome'),
    homepage: helpers.entryPoint('homepage'),
    welcomejapan: helpers.entryPoint('welcomejapan'),
    plp: helpers.entryPoint('plp'),
    styleguide: helpers.entryPoint('styleguide'),
  },

  // Responsible for resolving file system related lookup
  // https://webpack.github.io/docs/configuration.html#resolve
  resolve: {
    // The extensions of file types so webpack knows what is/isn't accepted
    // https://webpack.github.io/docs/configuration.html#resolve-extensions
    extensions: ['', '.js', '.scss'],
    // Shortens the lookup of a path to keyworded importing. By doing this, it
    // creates a standard for path resolution when modules are referenced.
    // https://webpack.github.io/docs/configuration.html#resolve-alias
    alias: {
      modules: join(helpers.scriptsDirectory(), 'modules'),
      vendor: join(helpers.scriptsDirectory(), 'vendor'),
      tracking: join(helpers.scriptsDirectory(), 'tracking'),
      templates: join(helpers.mobileDirectory(), 'templates'),
      'entry-points': join(helpers.scriptsDirectory(), 'entry-points')
    }
  },

  module: {
    // preLoaders are traditionally ran prior to any sort of compilation, in
    // case a build has been configured to fail fast. An example of this would
    // be linting.
    // https://webpack.github.io/docs/configuration.html#module-preloaders-module-postloaders
    preLoaders: [
      // Loader used for running against eslint. eslint will be ran upon any
      // JavaScript changing. Although it can take additional options, we can
      // default back to what eslint provides. For eslint specific
      // configuration, use either query params on the loader or the query
      // property. For non eslint specific configuration, i.e. things that
      // aren't specified in an eslintrc, set them on the top level in an eslint
      // property. All additional options can be found at:
      // https://github.com/MoOx/eslint-loader
      {
        test: /\.js$/,
        loader: "eslint-loader",
        exclude: /node_modules/
      }
    ],

    // Used to perform transformations based on whether file conditions have
    // been met.
    // https://webpack.github.io/docs/configuration.html#module-loaders
    // https://webpack.github.io/docs/loaders.html
    loaders: [
      // This loader handles the compilation of underscore templates, which
      // will bundle client side templates which no additional dependencies. We
      // are instructing the webpack when a file ending in .html is found (but
      // not found in node_modules) to run the underscore-template-loader.
      // https://github.com/emaphp/underscore-template-loader
      {
        test: /\.html$/,
        loader: "happypack/loader?id=underscore-template",
        exclude: /node_modules/
      }
    ]
  },

  // Ran upon the initial build. It accepts an array of plugins where each
  // plugin in the array conforms to the webpack plugin API
  // https://github.com/webpack/docs/wiki/How-to-write-a-plugin
  // https://webpack.github.io/docs/plugins.html
  plugins: [
    // Configure happypack to intercept underscore-template-loader compilation
    // for parallel compilation.
    helpers.createHappyPlugin('underscore-template', ['underscore-template-loader'])
  ],

  // Used for debugging the outputted source. In most situations, this relates
  // to source maps, where webpack provides a number of different types of
  // source maps that work well under certain environments.
  devtool: 'eval',

  // Instructs the destination of chunks (including entry points) and anything
  // else that produces output.
  // https://webpack.github.io/docs/configuration.html#output
  output: {
    // The location of the directory where files should go.
    // https://webpack.github.io/docs/configuration.html#output-path
    path: helpers.distDirectory(),
    // The file name of the output file. In our use case, we are using the
    // [name] token so the outputted name can be the entry point name. It can
    // also use other tokens such as [hash] and [chunkhash].
    // https://webpack.github.io/docs/configuration.html#output-filename
    filename: '[name].js',
    // Used for determining the location via a URL. It can be used for dynamic
    // chunks, if it's used in the future.
    // https://webpack.github.io/docs/configuration.html#output-publicpath
    publicPath: '/r/r_src/mobile/dist/'
  }
};
