'use strict';

var Promise = require('bluebird');
var npm = require('npm');
var path = require('path');
var karmaModules = {
  'karma-chai-plugins': '^0.2.1',
  'karma-detect-browsers': '^0.1.2',
  'karma-mocha': '^0.1.3'
};

module.exports = function(options) {
  var basePath = options.basePath;
  var configFile = path.join(options.basePath, 'karma.conf.js');

  namespace('test', function() {
    desc('Install testing dependencies');
    task('install', function() {
      var install = Object.keys(karmaModules).filter(function(module) {
        if(process.env.force === 'true') {
          return true;
        }
        try {
          require.resolve(path.join(basePath, 'node_modules', module));
          return false;
        }
        catch(e) {
          return true;
        }
      })
      .map(function(module) {
        return module + '@' + karmaModules[module];
      });

      if(install.length) {
        return new Promise(function(resolve, reject) {
          npm.load({}, function(err) {
            if(!err) {
              resolve()
            }
            else {
              reject(err);
            }
          })
        })
        .then(function() {
          return new Promise(function(resolve, reject) {
            npm.commands.install(install, function(err) {
              if(!err) {
                resolve();
              }
              else {
                reject(err);
              }
            })
          });
        });
      }
    });

    desc('Build project for production');
    task('unit', function() {
      var config = {
        configFile: configFile,
        files: []
      };

      if(process.env.project) {
        process.env.project.split(',').forEach(function(project) {
          var files = path.join(basePath, 'src', project, '**/*_test.js');
          config.files.push(files);
        });
      }
      else {
        config.files.push(path.join(basePath, 'src/**/*_test.js'));
      }

      return runKarma(config);
    });
  });

  function runKarma(options) {
    var karma = require(path.join(basePath, 'node_modules/karma'));

    switch(process.env.watch) {
      case 'server':
      case 'true':
        options.autoWatch = true;
        return new Promise(function(resolve) {
          karma.server.start(options, resolve);
        });

      case 'false':
      default:
        options.singleRun = true;
        return new Promise(function(resolve) {
          karma.runner.run(options, resolve);
        });
        break;
    }
  }
};

