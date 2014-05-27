'use strict';

require('sugar');
var Promise = require('bluebird');
var path = require('path');
var webpack = require('webpack');
var slice = Array.prototype.slice;

module.exports = function(options) {
  var configPath = path.join(options.basePath, 'webpack.config');
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
  var compiler = webpack(config);
  var args = slice.call(arguments, 2);

  return new Promise(function(resolve, reject) {
    args.push(callback);
    compiler[action].apply(compiler, args);

    function callback(err, stats) {
      if(!err) {
        console.log(stats.toString({
          colors: true
        }));
        resolve(stats);
      }
      else {
        reject(err);
      }
    }
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
