'use strict';

var path = require('path');

module.exports = function(opts) {
  return function(config) {
    config.set({
      frameworks: ['mocha', 'chai', 'detectBrowsers']
    });
  };
};
