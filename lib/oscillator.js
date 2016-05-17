var _ = require('lodash');
var bus = require('./bus');
var context = require('./audiocontext');
var extend = require('backbone').View.extend;
var simpleOsc = require('./simple-osc');
var noiseC = require('./noise-convolver');

var sm = require('scale-maker');

var pm = sm.makeScale('minorPentatonic', 'Eb2', 22).inHertz;

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

OscBase.prototype.note = function() {
	var frequency = pm[Math.floor( Math.random() * pm.length) ];
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
		this.volume = context.createGain();
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
