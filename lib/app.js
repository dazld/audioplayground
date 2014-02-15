var _ = require('lodash');
var $ = require('../vendor/jbone');
var bus = require('./bus');

var Backbone = require('backbone');
Backbone.$ = $;

var App = function(){
	this.bus = bus;
	this.startListening();
	this.initialize.apply(this, arguments);
};

App.prototype.startListening = function(){
	_.each(this.events, function(key, value){
		this.bus.on(key, this[value], this);
	}.bind(this));
};

App.prototype.initialize = function(){};

App.extend = Backbone.View.extend;

module.exports = App;