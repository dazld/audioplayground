var _ = require('lodash');
var clog = console.log.bind(console);

var Backbone = require('backbone');
var bus = require('bus');
var A = 440; // set A to be 440hz



var App = function(ctx){
	this.bus = bus;
	this.context = new webkitAudioContext();
	this.chain = [];
	this.initialize();
}

var App.extend = Backbone.extend;

var AudioApp = App.extend({
	events: {
		'play':'play'
		'pause':'pause'
	},
	initialize: function(){

	},
	play: function(){},
	pause: function(){},
	add: function (comp){
		this.bus.trigger('pause');
		this.chain.push(comp);
		this.bus.trigger('play');
	}
});


module.exports = App;