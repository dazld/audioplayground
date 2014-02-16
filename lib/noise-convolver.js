// http://noisehack.com/custom-audio-effects-javascript-web-audio-api/

var audioContext = require('./audiocontext');

var effect = (function() {
    var convolver = audioContext.createConvolver(),
        noiseBuffer = audioContext.createBuffer(2, 2 * audioContext.sampleRate, audioContext.sampleRate),
        left = noiseBuffer.getChannelData(0),
        right = noiseBuffer.getChannelData(1);
    for (var i = 0; i < noiseBuffer.length; i++) {
        left[i] = Math.random() * 2 - 1;
        right[i] = Math.random() * 2 - 1;
    }
    convolver.buffer = noiseBuffer;
    return convolver;
})();

module.exports = effect;