'use strict';

var fs = require('fs');
var path = require('path');

module.exports = function(opts) {
  var paths = {
    bower:    relativeToProject('bower_components'),
    modules:  relativeToProject('node_modules'),
    output:   relativeToProject('build'),
    shared:   relativeToProject('src/shared'),
    source:   relativeToProject('src')
  };

  return {
    context: paths.source,
    entry: entries(),
    resolve: {
      root: paths.source,
      modulesDirectories: [paths.modules, paths.bower, paths.shared],
      alias: {
        rx: 'rx/dist/rx.lite.compat.js',
        'rx-testing': 'rx/dist/rx.testing.js'
      }
    },
    output: {
      path: paths.output,
      filename: '[name]/index.js'
    },
    resolveLoader: {
      root: path.join(__dirname, '../node_modules')
    },
    module: {
      loaders: [
        {test: /\.(?:eot|gif|jpg|jpeg|png|svg|ttf|woff)$/, loader: 'url'},
        {test: /\.js$/, loader: 'jsx'},
        {test: /\.css$/, loader: 'style!css!autoprefixer'},
        {test: /\.less$/, loader: 'style!css!autoprefixer!less'},
      ]
    }
  };

  function entries() {
    return fs
      .readdirSync(paths.source)
      .filter(function(fileOrDir) {
        if(fileOrDir !== 'shared') {
          return fs.statSync(path.join(paths.source, fileOrDir)).isDirectory();
        }
        return false;
      })
      .reduce(function(obj, project) {
        obj[project] = project;
        return obj;
      }, {});
  }

  function relativeToProject(relativePath) {
    return path.join(opts.basePath, relativePath);
  }
};
