(function() {
	
	var X = 0;
	var Y = 1;
	var Z = 2;
	
	var self = window.Main = {
		connected : false
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
	
	self.checkHands = function(frame) {
		if(frame.hands.length > 0) {
			var hand = frame.hands[0];
			var relativeHeight = hand.palmPosition[Y] / 300;
			var relativeApperture = Math.max(((hand.sphereRadius - 60) / 40),0);
			
			Theremin.play(relativeHeight, relativeApperture);
		} else {
			Theremin.stop();
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
	
	var freqView = new FrequencyViewer('.freq-container', Theremin);
	
	freqView.populateTable();
})();
