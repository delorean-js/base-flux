'use strict';

require('sugar');
var Promise = require('bluebird');
var path = require('path');
var webpack = require('webpack');
var slice = Array.prototype.slice;

module.exports = function(options) {
  var configFile = path.join(options.basePath, 'webpack.config');
  var config = Object.clone(require(configFile), true);

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

  namespace('server', function() {
    desc('Continuously build project for development with a server');
    task('dev', ['watch:dev'], function() {
      return startServer();
    });

    desc('Continuously build project for production with a server');
    task('prod', ['watch:prod'], function() {
      return startServer();
    });
  })

  function startServer() {
    var server = require(path.join(options.basePath, 'server'));
    var port = process.env.port || 8000;
    return Promise.promisify(server.listen, server)(port).then(function() {
      console.log('\nServer started on port', port);
    });
  }
};

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
