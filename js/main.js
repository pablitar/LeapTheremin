(function() {
	
	var X = 0;
	var Y = 1;
	var Z = 2;
	
	var self = window.Main = {
		connected : false,
		stabilized : false,
		theremin : new Theremin()
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
	
	self.checkHands = function(frame) {
		if(frame.hands.length > 0) {
			var position = self.getPosition(frame.hands[0]);
			var relativeHeight = Math.max((position[Y] - 100) / 300, 0);
			var relativeDepth = Math.max(((-position[Z] + 100) / 30),0);
			
			self.theremin.play(relativeHeight, relativeDepth);
		} else {
			self.theremin.stop();
		}
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
	
	var freqView = new FrequencyViewer('.freq-container', self.theremin);
	
	var configForm = new ConfigurationForm('.config-container', self.theremin);
})();
