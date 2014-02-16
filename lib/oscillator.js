var _ = require('lodash');
var bus = require('./bus');
var context = require('./audiocontext');
var extend = require('backbone').View.extend;
var simpleOsc = require('./simple-osc');
var noiseC = require('./noise-convolver');

const A4 = 440;
var baseOctave = 4;

var OscBase = function(options) {
	options = options || {};
	options.type = options.type || 0; // sine 

	this.bus = bus;
	this.context = context;
	this.initialize.apply(this, arguments);

};

OscBase.prototype.getSource = function() {
	return this.volume;
};

OscBase.prototype.configure = function(options) {

	_.each(options, function(value, key) {
		this.osc[key] = value;
	}.bind(this));
};

OscBase.prototype.note = function(note, octave) {
	// fn = f0 * (a)n 
	// var notes = ['Ab', 'A', 'Bb', 'B', 'C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G'];
	// var toAdd = (octave * 12) - (baseOctave * 12);

	var frequency = Math.random() * 220 + 20;
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
	initialize: function(options){
		// setup and configure our oscillator
		this.osc = context.createOscillator();
		this.volume = context.createGainNode();
		this.panner = context.createPanner();
		this.reverb = noiseC;

		this.panControl = simpleOsc({
			min: -3,
			max: 3,
			inc: 0.005,
			start: Math.random() * 6 - 3,
			reverse: Math.random() > 0.5
		});
		
		// set base volume
		this.volume.gain.value = 0.1;

		this.configure(options);

		// listen to events
		this.startListening();
		// setup source (osc + gainnode)
		this.osc.connect(this.reverb);
		this.reverb.connect(this.volume);
		this.volume.connect(this.panner);
		
		// not working yet but should look something like..
		this.note('A', 5);
	}
});

module.exports = Oscillator;