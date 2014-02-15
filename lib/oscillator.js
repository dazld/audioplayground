var _ = require('lodash');
var bus = require('./bus');
var context = require('./audiocontext');
var extend = require('backbone').View.extend;

var A4 = 440;
var baseOctave = 4;

var OscBase = function(options) {
	options = options || {};
	options.type = options.type || 0; // sine 

	this.bus = bus;
	this.context = context;

	// setup and configure our oscillator
	this.osc = context.createOscillator();
	this.volume = context.createGainNode();

	// set base volume
	this.volume.gain.value = 0.1;

	this.configure(options);

	// bind to events
	this.startListening();
	// setup source (osc + gainnode)
	this.osc.connect(this.volume);
	this.note('A', 5);
	this.initialize.apply(this, arguments);
};

OscBase.prototype.getSource = function() {
	return this.volume;
};

OscBase.prototype.configure = function(options) {

	_.each(options, function(key, value) {
		this.osc[key] = value;
	}.bind(this));
};

OscBase.prototype.note = function(note, octave) {
	var notes = ['Ab', 'A', 'Bb', 'B', 'C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G'];
	
	var toAdd = (octave * 12) - (baseOctave * 12);
	console.log(notes.indexOf(note));
	console.log(toAdd);
	var frequency = Math.random() * 440 + 120;
	this.osc.frequency.value = frequency;
};

OscBase.prototype.startListening = function() {
	_.each(this.events, function(key, value) {
		this.bus.on(key, this[value], this);
	}.bind(this));
};

OscBase.prototype.initialize = function() {};

OscBase.extend = extend;

var Oscillator = OscBase.extend({

});

module.exports = Oscillator;