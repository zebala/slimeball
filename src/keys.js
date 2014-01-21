(function ($) {

	var Keys = function (game) {
		this.game = game;
		this.keyStatus = {};
		this.keyHitStatus = {};
		this.keyMap = { "left" : 37, "right" : 39, "up" : 38 , "space" : 32, "w" : 87, "a" : 65, "d" : 68};

		//add keyListeners
		var keys = this;
		$("#slimecontainer").on( 'keydown', function (event) { return keys.keyDown(event.which); });
		$("#slimecontainer").on( 'keyup', function (event) { return keys.keyUp(event.which); });
	};

	Keys.prototype.checkKey = function (key) {
		for (var k in this.keyMap) {
			if (this.keyMap[k] === key) {
				return true;
			}
		}
		return false;
	};

	Keys.prototype.keyDown = function (key) {
		if (this.checkKey(key)) {
			if (!this.keyStatus[key]) {
				this.keyHitStatus[key] = true;
			} else {
				this.keyHitStatus[key] = false;
			}
			this.keyStatus[key] = true;
			// return true;
		}
		return false;
	};

	Keys.prototype.keyUp = function (key) {
		if (this.checkKey(key)) {
			this.keyHitStatus[key] = false;
			this.keyStatus[key] = false;
			// return true;
		}
		return false;
	};

	Keys.prototype.isDown = function (keyString) {
		return this.keyStatus[this.keyMap[keyString]];
	};

	Keys.prototype.isHit = function (keyString) {
		return this.keyHitStatus[this.keyMap[keyString]];
	};

	SoccerSlime.Keys = function (game) {
		return new Keys(game);
	};

}(jQuery));
