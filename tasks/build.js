'use strict';

require('sugar');
var Promise = require('bluebird');
var path = require('path');
var webpack = require('webpack');
var split = Array.prototype.split;

module.exports = function(options) {
  var rootPath = path.join(process.cwd(), options.isProject ? '../..' : '');
  var configPath = path.join(rootPath, 'webpack.config');
  var config = Object.clone(require(configPath), true);

  namespace('build', function() {
    desc('Build project for development');
    task('dev', function() {
      filterProjects(config);
      addDevelopmentOptions(config);
      return runWebpack(config, 'run');
    });

    desc('Build project for production');
    task('prod', function() {
      filterProjects(config);
      addProductionOptions(config);
      return runWebpack(config, 'run');
    });
  });

  namespace('watch', function() {
    desc('Continuously build project for development');
    task('dev', function() {
      filterProjects(config);
      addDevelopmentOptions(config);
      return runWebpack(config, 'watch', 200);
    });

    desc('Continuously build project for production');
    task('prod', function() {
      filterProjects(config);
      addProductionOptions(config);
      return runWebpack(config, 'watch', 200);
    });
  });
};

function runWebpack(config, action) {
  var instance = webpack(config);
  return Promise
    .promisify(instance[action], instance)
    .apply(null, slice.call(arguments, 2))
    .then(function(stats) {
      console.log(stats.toString({
        colors: true
      }));
    });
}

function addDevelopmentOptions(config) {
  config.debug = true;
  config.devtool = 'inline-source-map';
}

function addProductionOptions(config) {
  config.plugins = config.plugins || [];
  config.plugins.push(new webpack.optimize.UglifyJsPlugin());
  config.plugins.push(new webpack.optimize.OccurenceOrderPlugin());
}

function filterProjects(options) {
  var project = process.env.project;
  if(project) {
    options.entry = Object.select(options.entry, project.split(','));
  }
}
