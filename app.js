var App = require('./lib/app');
var clog = console.log.bind(console);

var Osc = require('./lib/oscillator');
var simpleOsc = require('./lib/simple-osc');

var audioContext = require('./lib/audiocontext');



var AudioApp = App.extend({
	isPlaying: false,
	events: {
		'play': 'play',
		'pause': 'pause'
	},
	initialize: function(options) {
		clog('starting');
		options = options || {};

		this.bpm = options.bpm || 100;
		this.numOscillators = options.numOscillators || 4;

		this.context = audioContext;
		this.canvas = document.querySelector('canvas');
		this.drawCtx = this.canvas.getContext('2d');
		this.chain = [];
		this.oscillators = [];
		this.analyser = this.context.createAnalyser();
		this.analyser.smoothingTimeConstant = 0.85;
		// this.analyser.connect(this.context.destination);

		this.compressor = this.context.createDynamicsCompressor();
		this.compressor.connect(this.analyser);
		
		this.output = this.compressor;
		this.analyser.connect(this.context.destination);

		this.meter = document.createElement('div');
		this.meter.className = 'meters';


		// stereo
		this.setupOscillators();
		this.oscillators.forEach(function(osc) {
			var posMeter = document.createElement('span');

			window.setInterval(osc.note.bind(osc), (Math.random()*8000) << 0);
			window.setInterval(function(){
				var pos = osc.panControl();
				posMeter.textContent = pos.toFixed(2);
				osc.panner.setPosition(pos,0,0);
			}, 66 );

			this.meter.appendChild(posMeter)

		},this);
		document.body.appendChild(this.meter)
		
	},
	setupOscillators: function() {
		for (var i = 0; i < this.numOscillators; i++) {
			clog('building osc');
			// debugger;
			var osc = new Osc({
				type: 0
			});

			var source = osc.getSource();
			osc.osc.noteOn(0);
			this.oscillators.push(osc);
			source.connect(this.output);
		}
		process.nextTick(this.drawSpectrum.bind(this));
	},
	drawSpectrum: function() {
		// https://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/PlayingandSynthesizingSounds/PlayingandSynthesizingSounds.html
		var width = this.canvas.width;
		var height = this.canvas.height;
		var bar_width = 3;
		var ctx = this.drawCtx;
		var ratio = 164 / height;

		ctx.clearRect(0, 0, width, height);

		var freqByteData = new Uint8Array(this.analyser.frequencyBinCount);
		this.analyser.getByteFrequencyData(freqByteData);
		// console.log(freqByteData)
		var barCount = Math.round(width / bar_width);
		for (var i = 0; i < barCount; i++) {
			var magnitude = freqByteData[i];
			// scale magnitude to canvas height
			magnitude *= ratio;
			ctx.fillRect(bar_width * i, height, bar_width - 2, height - magnitude);
		}
		requestAnimationFrame(this.drawSpectrum.bind(this));
	},
	play: function() {
		clog('play');
	},
	pause: function() {
		clog('pause');
	},
	add: function(comp) {
		this.bus.emit('pause');
		this.chain.push(comp);
		process.nextTick(this.play.bind(this));
	}

});


module.exports = AudioApp;