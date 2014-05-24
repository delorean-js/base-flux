'use strict';

var Promise = require('bluebird');
var fs = require('fs');
var path = require('path');
var scaffolt = Promise.promisify(require('scaffolt'));

module.exports = function(options) {
  var generatorsType = options.inProject ? 'project' : 'root';
  var generatorsPath = path.join('../generators', generatorsType);
  var revert = false;

  // Aliases for generator tasks
  task('g', ['generate']);
  task('gen', ['generate']);
  task('d', ['destroy']);
  task('del', ['destroy']);

  // Iterate over non-module generators for creating tasks that scaffold
  desc('Scaffold item(s), or list available scaffolds');
  task('generate', function() {
    var promises = [];

    // Iterate over all available generators.
    generators(generatorsPath).forEach(function(generator) {
      var names = process.env[generator];
      if(names) {
        names.split(',').forEach(function(name) {
          if(generator !== 'project' || name !== 'shared') {
            promises.push(scaffolt(generator, name, {
              generatorsPath: generatorsPath,
              revert: revert
            }));
          }
        });
      }
    });

    // List available generators if no scaffolt commands were run
    if(promises.length) {
      return Promise.all(promises);
    }
    else {
      scaffolt.list();
    }
  });

  // Iterate over non-module generators for creating tasks that undo a scaffold
  desc('Destroy scaffolded item(s), or list available scaffolds');
  task('destroy', function() {
    revert = true;
    return jake.Task['generate'].execute();
  });
};

function generators(path) {
  return fs.readdirSync(path).filter(function(generator) {
    return fs.existsSync(path.join(path, generator, 'generator.json'));
  });
}
