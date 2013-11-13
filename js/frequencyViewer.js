(function() {
	window.FrequencyViewer = function(tableSelector, theremin) {
		var self = this;

		this.$el = $(tableSelector);
		this.theremin = theremin;

		this.populateTable = function() {
			var $row = this.$el.find('tr');
			$row.empty();
			for (var i = theremin.minPitch; i < theremin.maxPitch; i++) {
				$row.append(this.createPitchCell(i));
			}

			if (this.pointer) {
				this.pointer.parentNode.removeChild(this.pointer);
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

		this.createPitchCell = function(pitch) {
			var td = document.createElement('td');
			td.innerText = this.theremin.getNoteName(pitch);

			return td;
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

