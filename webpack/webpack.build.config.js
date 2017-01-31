var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HappyPack = require('happypack');
var SVGStore = require('webpack-svgstore-plugin');
var Sprity = require('./sprity');
var config = require('./webpack.common.config');
var helpers = require('./webpack-helpers');
var join = path.join;
// This includes all loaders that are used for sass compilation. If you look at
// this in reverse order, when webpack sees a file that ends in scss, it will:
//
// - run the sass-loader on the provided file which will turn the sass into CSS
// - run resolve-url to make sure webpack knows how to interpet assets with url()
// - run css-loader to take the compiled CSS and have it embedded in the
//   JavaScript or in our case, have it extracted with the ExtractTextPlugin
//
// https://github.com/jtangelder/sass-loader
// https://github.com/bholloway/resolve-url-loader
// https://github.com/webpack/css-loader
var style = helpers.containsCommandLineArg('--expand-css') ? '' : 'minimize';
var sassLoaders = [
  'css-loader?' + style + '&sourceMap',
  'resolve-url',
  'sass-loader?sourceMap&precision=8'
];

module.exports = merge(config, {
  module: {
    // Used to perform transformations based on whether file conditions have
    // been met.
    // https://webpack.github.io/docs/configuration.html#module-loaders
    // https://webpack.github.io/docs/loaders.html
    loaders: [
      // Looks to any scss files not found in node_modules and compiles them to
      // the style named loader through ExtractTextPlugin. This may look unusual
      // compared to other loaders, but using ExtractTextPlugin allows webpack
      // to pull out any CSS based on the entry point into a CSS file. Think of
      // this as the extraction or setup. The output of this is configured in
      // plugins below. Instead of referencing the loaders directly, we are
      // referencing the happypack version of the loader so the loader can be
      // ran in parallel.
      // https://github.com/webpack/extract-text-webpack-plugin
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', sassLoaders.join('!')),
        exclude: /node_modules/
      },

      // The url-loader here is being used for any sass file which includes
      // images. We check for an png file types and specify the mimetype. Other
      // options can be provided, but we keep with the default where it will
      // base64 encode the image directly in the outputted CSS file. We do not
      // use happypack here because there is a current issue with the extract
      // plugin and nested loaders. However, the performance cost is negligible
      // as the big performance gains are made by parallizing the sass-loader.
      // https://github.com/webpack/url-loader
      {
        test: /\.png$/,
        loader: "url-loader",
        query: { mimetype: "image/png" },
        exclude: /node_modules/
      },
      // SVG LOADER
      {
        test: /\.svg$/,
        loader: 'svg-url-loader',
        include: /svg\/backgrounds/
      }
    ]
  },

  // Ran upon the initial build. It accepts an array of plugins where each
  // plugin in the array conforms to the webpack plugin API
  // https://github.com/webpack/docs/wiki/How-to-write-a-plugin
  // https://webpack.github.io/docs/plugins.html
  plugins: [
    // Configure happypack to intercept named loader style for parallel
    // compilation. The helper accepts an id (or unique name) and a list of
    // loaders. See sassLoaders for details about the loaders being included.
    // sassLoaders is an array but we separate each loader with a ! as this is
    // how webpack separates passed in loaders.
    // https://webpack.github.io/docs/configuration.html#module-loaders
    // helpers.createHappyPlugin('style', [sassLoaders.join('!')]),

    // This instructs ExtractTextPlugin where the extracted CSS should go.
    // Although we are specifying a token of [name], there are other tokens such
    // as [id] and [contenthash] (similar to filename in output.filename).
    // https://github.com/webpack/extract-text-webpack-plugin#api
    new ExtractTextPlugin('[name].css'),

    // This is a custom plugin which acts as a middleman between webpack and
    // sprity. For more information see ./webpack/sprity.js. Sprity is a sprite
    // generated that is highly customizable and versatile.
    // https://github.com/sprity/sprity
    new Sprity({
      processor: 'sass',
      cssPath: '.',
      dimension: [{
        ratio: 1, dpi: 72
      }, {
        ratio: 2, dpi: 192
      }],
      margin: 1,
      out: join(helpers.distDirectory(), 'sprite'),
      src: join(helpers.mobileDirectory(), 'lib', 'imgs', 'sprite', '**', '*'),
      style: join('..', '..', 'lib', 'scss', 'sprite', 'main.scss'),
      base64: true
    }),

    // We are using CommonsChunkPlugin so that any common code across 2 or more
    // entry points gets rolled up in the chrome entry point. By doing this, we
    // share common code across a single file to get cachability and keep script
    // payloads smaller. This is also referred to as "code splitting" and where
    // a "chunk" (basically a file) contains whatever common code that has been
    // configured. It's a very powerful and flexible feature from webpack, that
    // can be expressed in many forms.
    // https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
    // https://webpack.github.io/docs/code-splitting.html
    new webpack.optimize.CommonsChunkPlugin({
      name: ['chrome'],
      minChunks: 2
    }),

    // We are using the svg store plugin to take svg files and compress them to
    // a single file. This will happen on initial build, but keep in mind, with
    // the amount of files, it's pretty slow so we should look into optimizing
    // this process.
    // https://github.com/mrsum/webpack-svgstore-plugin/tree/v2.1.0
    new SVGStore(
      [ join(helpers.mobileDirectory(), 'lib', 'imgs', 'svg', 'enabled', '*.svg') ],
      join('svg'),
      {
        name: 'sprite.svg'
      }
    )
  ],

  // Instructs webpack of any required modules that already exist on the window
  // or globally.
  // https://webpack.github.io/docs/configuration.html#externals
  externals: {
    // jQuery already exists on the window since Optimizely is depending on it.
    // Therefore, there is no need for jQuery to be part of the bundled output.
    jquery: 'jQuery'
  }
});
