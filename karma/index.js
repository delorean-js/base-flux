'use strict';

require('sugar');
var path = require('path');

module.exports = function(options) {
  return function(config) {
    var webpackConfig = require(path.join(options.basePath, 'webpack.config'));
    webpackConfig = Object.reject(webpackConfig, 'context', 'entry', 'output');

    config.set({
      autoWatch: true,
      basePath: path.join(options.basePath, 'src'),
      frameworks: ['mocha', 'chai', 'detectBrowsers'],
      preprocessors: {
        '**/*_test.js': ['webpack']
      },
      webpack: webpackConfig
    });
  };
};
