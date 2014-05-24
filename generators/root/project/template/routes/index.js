'use strict';

var dispatcher = require('lib/dispatcher');
var router = require('lib/router');
exports.start = router.start;

router.on('index', '/', function() {
  dispatcher.dispatch('view#set', {view: 'index'});
});

router.on('*', function() {
  dispatcher.dispatch('view#set', {view: '404'});
});
