var SimpleOsc = function(options){
	options = options || {};
	var min = options.min || -1;
	var max = options.max || 1;
	var inc = options.inc || 0.1;
	var start = options.start || 0;
	var reverse = options.reverse || false;

	var direction = reverse ? -1 : 1;

	return function(rev){
		if (start >= max) {
			direction = -1;
		}

		if (start <= min) {
			direction = 1;
		}

		start = start + direction*inc;
		// start = parseFloat(start.toFixed(4));
		return start;
	}
}

module.exports = SimpleOsc;