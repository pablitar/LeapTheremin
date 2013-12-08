(function() {

	window.Theremin = function() {
		$.extend(this, {
			absoluteMinPitch : 36,
			absoluteMaxPitch : 96,
			minPitch : 60,
			maxPitch : 84,
			snap : false
		}, behaviours.Events);

		var self = this;		

		self.getNoteName = function(pitch) {
			var semitones = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
			semitone = semitones[pitch % 12];
			scale = Math.floor(pitch / 12) - 1;

			return semitone + scale;
		};

		self.oscil = new WX.Oscil({
			type : 'sine'
		});


		self.oscil.active = false;
		self.oscil.to(WX.DAC);

		self.performSnap = function(value) {
			if (self.snap) {
				value = WX.pitch2freq(WX.freq2pitch(value));
			}

			return value;
		};
		
		self.setType = function(type) {
			self.oscil.type = type;
		};
		
		self.getType = function() {
			return self.oscil.type;
		};

		self.minFrequency = function() {
			return WX.pitch2freq(self.minPitch);
		};

		self.maxFrequency = function() {
			return WX.pitch2freq(self.maxPitch);
		};
		
		self.setRange = function(minPitch, maxPitch) {
			this.minPitch = minPitch;
			this.maxPitch = maxPitch;
			
			this.trigger('frequencyRange');
		};

		self.play = function(relativeFreq, relativeVolume) {
			self.relativeFrequency = relativeFreq;
			self.oscil.frequency = self.performSnap(self.relativeFrequency * (self.maxFrequency() - self.minFrequency()) + self.minFrequency());
			self.oscil.gain = Math.min(relativeVolume, 1);

			self.oscil.active = true;

			self.trigger('frequencyChanged');
		};

		self.getFrequency = function() {
			return self.oscil.frequency;
		};

		self.getRelativeFrequency = function() {
			return self.relativeFrequency;
		};

		self.stop = function() {
			self.oscil.active = false;
			self.trigger('stoped');
		};
	};
})();
