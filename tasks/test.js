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
  var configFile = path.join(options.basePath, 'karma.conf.js');

  namespace('test', function() {
    desc('Install testing dependencies');
    task('install', function() {
      var install = Object.keys(karmaModules).filter(function(module) {
        if(process.env.force === 'true') {
          return true;
        }
        try {
          require.resolve(path.join(options.basePath, 'node_modules', module));
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

    desc('Run and evaluate unit tests');
    task('unit', function() {
      var config = {
        configFile: configFile
      };

      if(process.env.project) {
        config.files = process.env.project.split(',').map(function(project) {
          return path.join(project, '**/*_test.js');
        });
      }
      else {
        config.files = ['**/*_test.js'];
      }

      return runKarma(config);
    });
  });

  function runKarma(config) {
    var karma = require(path.join(options.basePath, 'node_modules/karma'));

    switch(process.env.watch) {
      case 'server':
      case 'true':
        options.singleRun = false;
        return new Promise(function(resolve) {
          karma.server.start(config, resolve);
        });

      case 'false':
      default:
        options.singleRun = true;
        return new Promise(function(resolve) {
          karma.runner.run(config, resolve);
        });
        break;
    }
  }
};

