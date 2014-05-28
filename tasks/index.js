'use strict';

require('sugar');
var fs = require('fs');
var path = require('path');

module.exports = function(options) {
  var rootPath = process.cwd();
  options = options || {};

  // If we are inside a project, set the project name
  if(options.isProject) {
    process.env.project = path.basename(process.cwd());
  }

  // Load tasks
  tasks().forEach(function(task) {
    require(path.join(__dirname, task))(options);
  });

  // Set default task
  task('default', function() {
    jake.run('-T');
  });
};

function tasks() {
  return fs
  .readdirSync(__dirname)
  .filter(function(fileOrDir) {
    return fs.statSync(path.join(__dirname, fileOrDir)).isFile();
  })
  .filter(function(file) {
    return file.endsWith('.js');
  })
  .filter(function(file) {
    return file !== 'index.js';
  });
}
