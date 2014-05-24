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
    var promises = [];

    // Iterate over all available generators.
    generators(generatorsPath).forEach(function(generator) {
      var names = process.env[generator];
      if(names) {
        names.split(',').forEach(function(name) {
          if(generator !== 'project' || name !== 'shared') {
            promises.push(scaffoltP(generator, name, {
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
      scaffolt.list({generatorsPath: generatorsPath});
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
    return fs.existsSync(path.join(generatorsPath, generator, 'generator.json'));
  });
}
