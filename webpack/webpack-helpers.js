var path = require('path');
var join = path.join;
var resolve = path.resolve;
var HappyPack = require('happypack');
var DEFAULT_THREAD_POOL = 4;

module.exports = {
  mobileDirectory: mobileDirectory,
  scriptsDirectory: scriptsDirectory,
  distDirectory: distDirectory,
  createHappyPlugin: createHappyPlugin,
  entryPoint: entryPoint,
  containsCommandLineArg: containsCommandLineArg,
  DEFAULT_THREAD_POOL: DEFAULT_THREAD_POOL
};

/**
 * Resolves to the mobile directory.
 * @return {string} The full path to the mobile directory.
 */
function mobileDirectory() {
  return resolve();
}

/**
 * Resolves to the scripts directory.
 * @return {string} The full path to the scripts directory.
 */
function scriptsDirectory() {
  return join(mobileDirectory(), 'lib', 'scripts');
}

/**
 * Resolves to the dist directory.
 * @return {string} The full path to the dist directory.
 */
function distDirectory() {
  return join(mobileDirectory(), 'dist');
}

/**
 * Accepts the directory name to create the full path for an entry point.
 * @param  {string} dirName The directory name
 * @return {string} The full path to the entry point
 */
function entryPoint(dirName) {
  return join(scriptsDirectory(), 'entry-points', dirName, 'index.js');
}

/**
 * Takes in a target arg and sees if the current process.argv is contained
 * within the list.
 * @param  {string} targetArg The argument being searched on
 * @return {Boolean} Whether the arg appears in arg list
 */
function containsCommandLineArg(targetArg) {
  return process.argv.some(function(arg) {
    return targetArg === arg;
  });
};

/**
 * This simple helper calls on the HappyPack plugin. A helper has been created
 * so that we have consistent and consolidated results when environment
 * variables are being set.
 * @param {string} id The id for the loader
 * @param {Array} loaders List of loaders
 * @return {HappyPlugin} A HappyPlugin instance
 */
function createHappyPlugin(id, loaders) {
  return new HappyPack({
    id: id,
    loaders: loaders,
    threadPool: HappyPack.ThreadPool({ size: process.env.HAPPY_THREAD_POOL ? parseInt(process.env.HAPPY_THREAD_POOL, 10) : DEFAULT_THREAD_POOL }),
    cache: !!process.env.HAPPY_CACHE,
    verbose: !!process.env.HAPPY_VERBOSE,
    enabled: !process.env.HAPPY_DISABLE
  });
}
