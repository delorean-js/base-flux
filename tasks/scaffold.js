'use strict';

var Promise = require('bluebird');
var fs = require('fs');
var path = require('path');
var scaffolt = require('scaffolt');
var scaffoltP = Promise.promisify(scaffolt);

module.exports = function(options) {
  var generatorsType = options.isProject ? 'project' : 'root';
  var generatorsPath = path.join(__dirname, '../generators', generatorsType);
  var revert = false;

  // Aliases for generator tasks
  task('g', ['generate']);
  task('gen', ['generate']);
  task('d', ['destroy']);
  task('del', ['destroy']);

  // Iterate over non-module generators for creating tasks that scaffold
  desc('Scaffold item(s), or list available scaffolds');
  task('generate', function() {
    // Iterate over all available generators
    var params = generators(generatorsPath)
      .map(function(generator) {
        return {
          generator: generator,
          names: process.env[generator]
        };
      })
      .filter(function(param) {
        return param.names;
      })
      .map(function(param) {
        return param.names.split(',').map(function(name) {
          return {
            generator: param.generator,
            name: name
          };
        });
      })
      .reduce(function(a, b) {
        return a.concat(b);
      })
      .filter(function(param) {
        return param.generator !== 'project' || param.name !== 'shared';
      });

    // Run scaffolt commands sequentially, clearing cache of generator.json
    // at each step to avoid read-only errors
    if(params.length) {
      return Promise.reduce(params, function(initial, param) {
        Object.keys(require.cache).filter(function(path) {
          return path.endsWith('generator.json');
        })
        .forEach(function(path) {
          delete require.cache[path];
        });
        return scaffoltP(param.generator, param.name, {
          generatorsPath: generatorsPath,
          revert: revert
        });
      }, 0);
    }
    else {
      scaffolt.list({
        generatorsPath: generatorsPath
      });
    }
  });

  // Iterate over non-module generators for creating tasks that undo a scaffold
  desc('Destroy scaffolded item(s), or list available scaffolds');
  task('destroy', function() {
    revert = true;
    return jake.Task['generate'].execute();
  });
};

function generators(generatorsPath) {
  return fs.readdirSync(generatorsPath).filter(function(generator) {
    generator = path.join(generatorsPath, generator, 'generator.json');
    return fs.existsSync(generator);
  });
}
