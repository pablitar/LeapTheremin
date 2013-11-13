(function(){
	var self = window.Theremin = {
		minFrequency: WX.pitch2freq(40),
		maxFrequency: WX.pitch2freq(60),
		snap : true 
	};
	
	self.oscil = new WX.Oscil();
	
	window.oscil = self.oscil;
	
	self.oscil.active = false;
	self.oscil.to(WX.DAC)
	
	self.performSnap = function(value) {
		if(self.snap) {
			value = WX.pitch2freq(WX.freq2pitch(value));
		}
		
		return value;
	};

	self.play = function(relativeFreq, relativeVolume) {
		self.oscil.frequency = self.performSnap(relativeFreq * (self.maxFrequency - self.minFrequency) + self.minFrequency);
		self.oscil.gain = Math.min(relativeVolume, 1);
		
		self.oscil.active = true;
	};
	
	self.stop = function() {
		self.oscil.active = false;
	};
	
})();
