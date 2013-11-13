(function() {
	window.FrequencyViewer = function(tableSelector, theremin) {
		var self = this;

		this.$el = $(tableSelector);
		this.theremin = theremin;

		this.populateTable = function() {
			this.$el.empty();
			for (var i = this.theremin.minPitch; i <= this.theremin.maxPitch; i++) {
				this.$el.append(this.createPitchElement(i));
			}

			this.pointer = this.createPointer();

			this.$el.append(this.pointer);
		};

		this.createPointer = function() {
			var pointer = document.createElement('div');

			pointer.style.width = "5px";
			pointer.style.height = "100%";
			pointer.style.position = "absolute";
			pointer.style["background-color"] = 'red';
			pointer.style.top = "0px";

			pointer.style.visibility = "hidden";

			return pointer;
		};

		this.hidePointer = function() {
			this.pointer.style.visibility = "hidden";
		};

		this.showPointer = function() {
			this.pointer.style.visibility = "visible";
		};
		
		this.updatePointerPosition = function(relativePosition) {
			this.pointer.style.left = Math.floor(relativePosition * this.pointer.parentNode.offsetWidth).toString() + "px";
		};

		this.updateFrequency = function() {
			var frequency = this.theremin.getFrequency();
			var relativeFrequency = this.theremin.getRelativeFrequency();
			
			this.showPointer();
			this.updatePointerPosition(relativeFrequency);
		};
		
		this.getPitchPosition = function(pitch) {
			var pitchRelativePosition = (WX.pitch2freq(pitch) - this.theremin.minFrequency()) / (this.theremin.maxFrequency() - this.theremin.minFrequency());
			return pitchRelativePosition * this.$el.width();
		};

		this.createPitchElement = function(pitch) {
			var div = document.createElement('div');
			div.className =  'pitch-element';
			div.innerText = this.theremin.getNoteName(pitch);
			div.style.left = this.getPitchPosition(pitch) + "px";

			return div;
		};

		this.populateTable();

		this.theremin.on('frequencyRange', function() {
			self.populateTable();
		});

		this.theremin.on('frequencyChanged', function() {
			self.updateFrequency();
		});

		this.theremin.on('stoped', function() {
			self.hidePointer();
		});

	};
})();

