'use strict';

var Rx = require('rx');
var dispatcher = require('lib/dispatcher');
var observable = dispatcher.ofStore('view');
var subject = new Rx.BehaviorSubject({});

module.exports = subject.toStore();

observable.ofAction('set').subscribe(function(data) {
  subject.onNext({view: data.view});
});
