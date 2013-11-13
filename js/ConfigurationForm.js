function ConfigurationForm(containerSelector, theremin) {
	var minPitchSelector = '#minPitch';
	var maxPitchSelector = '#maxPitch';
	
	this.$el = $(containerSelector);
	this.theremin = theremin;
	
	var self = this;
	
	this.createOption = function(pitch) {
		return '<option value="'+ pitch + '">' + theremin.getNoteName(pitch) + '</option>';
	};
	
	this.populatePitchSelect = function(selector, min, max, currentValue) {
		var $select = this.$el.find(selector);
		$select.empty();  
		for(var i = min; i < max; i++) {
			$select.append(this.createOption(i));
		}
		
		$select.val(currentValue);
	};
	
	this.refreshMinPitch = function() {
		this.populatePitchSelect(minPitchSelector, this.theremin.absoluteMinPitch, this.theremin.maxPitch, this.theremin.minPitch);
	};
	
	this.refreshMaxPitch = function() {
		this.populatePitchSelect(maxPitchSelector, this.theremin.minPitch, this.theremin.absoluteMaxPitch, this.theremin.maxPitch); 
	};
	
	this.refreshSelects = function() {
		this.refreshMinPitch();
		this.refreshMaxPitch();
	};
	
	this.getValue = function(selector, transform) {
		if(!transform) {
			transform = function(x) {return x;};
		}
		return transform(this.$el.find(selector).val());
	};
	
	this.bindSelects = function() {
		this.$el.find(maxPitchSelector + ',' + minPitchSelector).on('change', function(){
			self.theremin.setRange(self.getValue(minPitchSelector, parseInt), self.getValue(maxPitchSelector, parseInt));
		});
	};
	
	this.bindSignalType = function() {
		var $oscil = this.$el.find('#oscilType');
		$oscil.val(this.theremin.getType());
		$oscil.on('change', function() {
			self.theremin.setType(self.getValue('#oscilType'));
		});
	};
	
	this.refreshSelects();
	this.bindSelects();
	this.bindSignalType();
	this.theremin.on('frequencyRange', function(){
		self.refreshSelects();
	});
}
