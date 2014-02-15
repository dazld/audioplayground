var _ = require('lodash');
var bus = require('./bus');
var context = require('./audiocontext');
var extend = require('backbone').View.extend;

var OscBase = function(options){
	options = options || {};
	options.type = options.type || 0; // sine 
	this.bus = bus;
	this.context = context;
	this.osc = context.createOscillator(options);
	this.startListening();
	this.initialize.apply(this, arguments);
};

OscBase.prototype.startListening = function(){
	_.each(this.events, function(key, value){
		this.bus.on(key, this[value], this);
	}.bind(this));
};

OscBase.prototype.initialize = function(){};

OscBase.extend = extend;

var Oscillator = OscBase.extend({

});

module.exports = Oscillator;