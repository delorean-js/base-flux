'use strict';

var path = require('path');

module.exports = function(options) {
  return function(config) {
    config.set({
      autoWatch: true,
      basePath: path.join(options.basePath, 'src'),
      frameworks: ['mocha', 'chai', 'detectBrowsers']
    });
  };
};
