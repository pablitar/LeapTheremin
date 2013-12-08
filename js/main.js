(function() {
	
	var X = 0;
	var Y = 1;
	var Z = 2;
	
	var self = window.Main = {
		connected : false,
		stabilized : false,
		theremins : [ {hand:null, theremin: new Theremin()}, {hand:null, theremin: new Theremin()}],
	};
	
	self.isConnected = function() {
		return self.connected;
	};
	
	self.onConnected = function() {
		self.connected = true;
	};
	
	self.onDisconnected = function() {
		self.connected = false;
	};
	
	self.restartController = function() {
		if (self.leapController) {
			self.leapController.once("disconnect", function() {
				self.connect();
			});
			self.disconnect();
		} else {
			self.initController();
		}
	};
	
	self.getPosition = function(aHand) {
		return self.stabilized?aHand.stabilizedPalmPosition:aHand.palmPosition;
	};
	
	self.updateTheremins = function() {
		self.theremins.forEach(function(assoc){
			if(assoc.hand) {
				var position = self.getPosition(assoc.hand);
				var relativeHeight = Math.max((position[Y] - 100) / 300, 0);
				var relativeDepth = Math.max(((-position[Z] + 100) / 60),0);
					
				assoc.theremin.play(relativeHeight, relativeDepth);
			} else {
				assoc.theremin.stop();
			}
		});
	};
	
	self.checkHands = function(frame) {
		var freeTheremins = self.theremins.slice(0);
		var freeHands = frame.hands.filter(function(aHand){
			return !self.theremins.some(function(assoc){
				if(assoc.hand && assoc.hand.id == aHand.id){
					assoc.hand = aHand;
					freeTheremins.splice(freeTheremins.indexOf(assoc), 1);
					return true;
				} else {
					return false;
				}
			});
		});
		
		freeTheremins.forEach(function(assoc) {
			assoc.hand = freeHands.splice(0,1)[0];
		});
		
		self.updateTheremins();
	};

	self.initController = function() {
		self.leapController = new Leap.Controller({
			enableGestures : true
		});

		self.leapController.on("connect", function() {
			self.onConnected();
		});

		self.leapController.on("disconnect", function() {
			self.onDisconnected();
		});

		self.leapController.connect();

		self.leapController.on("frame", function(frame) {
			window.currentFrame = frame;
			self.checkHands(frame);
		});
	};
	
	self.restartController();
	
	new FrequencyViewer('.freq1', self.theremins[0].theremin);
	new FrequencyViewer('.freq2', self.theremins[1].theremin);
	
	new ConfigurationForm('.conf1', self.theremins[0].theremin);
	new ConfigurationForm('.conf2', self.theremins[1].theremin);
})();
