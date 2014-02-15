var App = require('./lib/app');
var clog = console.log.bind(console);

var audioContext = require('./lib/audiocontext');

var A = 440; // set A to be 440hz



var AudioApp = App.extend({
	events: {
		'play':'play',
		'pause':'pause'
	},
	initialize: function(options){
		this.context = audioContext;
		this.chain = [];
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