/** @jsx React.DOM */
'use strict';

var React = require('react');
var viewStore = require('./stores/view');

module.exports = React.createClass({
  displayName: 'App',
  componentDidMount: function() {
    this.subscription = viewStore
      .distinctUntilChanged()
      .subscribe(this.setView);
  },
  componentWillUnmount: function() {
    this.subscription.dispose();
  },
  setView: function(data) {
    this.setState({view: data.view});
  },
  getView: function() {
    try {
      return require('./views/' + this.state.view);
    }
    catch(e) {
      return React.DOM.div;
    }
  },
  render: function() {
    var view = this.getView();
    return (
      <view/>
    );
  }
});
