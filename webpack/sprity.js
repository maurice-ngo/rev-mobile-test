// https://github.com/webpack/docs/wiki/how-to-write-a-plugin

var sprity = require('sprity');
var _ = require('lodash');

var DEFAULT_OPTIONS = {
  out: '',
  name: 'sprite',
  style: null,
  dimension: [{ratio: 1, dpi: 72}],
  engine: 'lwip',
  cssPath: '../images',
  format: 'png',
  processor: 'css',
  orientation: 'vertical',
  margin: 5,
  prefix: 'icon',
  background: '#FFFFFF',
  sort: true,
  split: false,
  opacity: 0,
  'style-indent-char': 'space',
  'style-indent-size': 2
};

module.exports = WebpackSprity;

function WebpackSprity(options) {
  this.options = _.merge({}, DEFAULT_OPTIONS, options || {});
  this.didRunWatch = false;
}

WebpackSprity.prototype.apply = function(compile) {
  compile.plugin('run', this.runCallback.bind(this));

  compile.plugin('watch-run', function(compiler, callback) {
    if (!this.didRunWatch) {
      this.didRunWatch = true;
      this.runCallback(compiler, callback);
    } else {
      callback();
    }
  }.bind(this));
};

WebpackSprity.prototype.runCallback = function(compiler, callback) {
  sprity.create(this.options, callback);
};
