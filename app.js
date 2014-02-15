var App = require('./lib/app');
var clog = console.log.bind(console);

var Osc = require('./lib/oscillator');

var audioContext = require('./lib/audiocontext');

const A = 440; // set A to be 440hz



var AudioApp = App.extend({
	isPlaying: false,
	events: {
		'play':'play',
		'pause':'pause'
	},
	initialize: function(options){
		clog('starting');
		options = options || {};

		this.bpm = options.bpm || 100;
		this.numOscillators = options.numOscillators || 5;

		this.context = audioContext;
		this.chain = [];
		this.oscillators = [];
		this.setupOscillators();
	},
	setupOscillators: function(){
		for (var i = 0; i < this.numOscillators; i++){
			clog('building osc');
			// debugger;
			var osc = new Osc({
				type: i
			});
			var source = osc.getSource();
			osc.osc.noteOn(0);
			this.oscillators.push(osc);
			source.connect(this.context.destination);
		}
	},

	play: function(){
		clog('play');
	},
	pause: function(){
		clog('pause');
	},
	add: function (comp){
		this.bus.emit('pause');
		this.chain.push(comp);
		process.nextTick(this.play.bind(this));
	}

});


module.exports = AudioApp;