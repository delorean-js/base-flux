'use strict';

require('sugar');

module.exports = function(Handlebars) {
  Handlebars.registerHelper('camelize', function(string, cleanSlashes) {
    return parseString(string, cleanSlashes).camelize(false);
  });

  Handlebars.registerHelper('dasherize', function(string, cleanSlashes) {
    return parseString(string, cleanSlashes).dasherize();
  });

  Handlebars.registerHelper('humanize', function(string) {
    return parseString(string, true).underscore().humanize();
  });

  Handlebars.registerHelper('titleize', function(string) {
    return parseString(string, true).titleize();
  });

  Handlebars.registerHelper('underscore', function(string, cleanSlashes) {
    return parseString(string, cleanSlashes).underscore();
  });

  Handlebars.registerHelper('uppercamelize', function(string, cleanSlashes) {
    return parseString(string, cleanSlashes).camelize(true);
  });
};

function parseString(string, cleanSlashes) {
  if(cleanSlashes === true) {
    string = string.replace(/\//g, ' ');
  }
  return string;
}
