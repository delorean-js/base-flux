'use strict';

require('sugar');
var path = require('path');
var tasksDirectory = path.join(__dirname, 'tasks');

module.exports = function(options) {
  var rootPath = process.cwd();
  options = options || {};

  // If we are inside a project, set the project name
  if(options.isProject) {
    process.env.project = path.basename(process.cwd());
  }

  // Load tasks
  tasks().forEach(function(task) {
    require(path.join(tasksDirectory, task))(options);
  });

  // Set default task
  task('default', function() {
    jake.run('-T');
  });
};

function tasks() {
  return fs
  .readdirSync(tasksDirectory)
  .filter(function(fileOrDir) {
    return fs.statSync(path.join(tasksDirectory, fileOrDir)).isFile();
  })
  .filter(function(file) {
    return file.endsWith('.js');
  });
}
