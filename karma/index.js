'use strict';

var path = require('path');

module.exports = function(opts) {
  return function(config) {
    config.set({
      autoWatch: true,
      frameworks: ['mocha', 'chai', 'detectBrowsers']
    });
  };
};
