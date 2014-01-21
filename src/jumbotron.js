(function ($) {

	/**
	 * Creates a jumbotron and adds a jumbotron layer to the Stage. Requires Teams and Stage.
	 * @param  {SoccerSlime.Game} game
	 * @return {undefined}
	 */
	var Jumbotron = function (game) {
		var size = game.size;
		this.game = game;
		this.obj = new Kinetic.Layer();
		this.obj.add(
			new Kinetic.Rect({
				x: 0,
				y: 0,
				width: size.width,
				height: 75,
				fill: 'black',
				opacity: 0.7
			})
		);
		this.teamName = [];
		for (var i = 0; i < 2; i++) {
			this.teamName[i] = new Kinetic.Text({
				y: 20,
				fontSize: 25,
				fontFamily: 'Arial',
				fill: 'white'
			});
			this.teamName[i].setX(20);
			this.updateTeam(i);
			this.obj.add(this.teamName[i]);
		}
		this.halfText = new Kinetic.Text({
			x: 0,
			y: 5,
			width: size.width,
			align: "center",
			fontSize: 25,
			fontFamily: 'Arial',
			fill: 'white'
		});
		this.obj.add(this.halfText);
		this.clock = new Kinetic.Text({
			x: 0,
			y: 35,
			width: size.width,
			align: "center",
			fontSize: 25,
			fontFamily: "Arial",
			fill: "white"
		});
		this.init();
		this.obj.add(this.clock);
		game.stage.obj.add(this.obj);
		this.animation = new Kinetic.Animation(clockAnimation(this), this.obj);
	};

	var jumboproto = Jumbotron.prototype;

	jumboproto.updateTeam = function (teamNum) {
		this.teamName[teamNum].setText(this.game.teams[teamNum].name + ": " + this.game.teams[teamNum].goals);
		if (teamNum === 1) {
			this.teamName[teamNum].setX(this.game.size.width - 20 - this.teamName[teamNum].getWidth());
		}
	};

	jumboproto.init = function () {
		this.setHalf(1);
		this.resetClock();
	};

	jumboproto.setHalf = function (val) {
		if (typeof val !== "number") {
			return;
		}
		this.half = val;
		this.halfText.setText(val + (val === 1? "st": "nd") + " Half");
	};

	jumboproto.resetClock = function () {
		this.time = 0;
		this.updateClock();
	};

	jumboproto.updateClock = function () {
		this.clock.setText(Math.floor(this.time / 1000) + ":" + (this.time % 1000 < 100? "0": "") /*+ (this.time % 1000 < 10? "0": "")*/ + Math.floor(this.time % 1000 / 10) );
	};

	jumboproto.startClock = function () {
		this.animation.start();
	};

	jumboproto.stopClock = function () {
		this.animation.stop();
	};

	function clockAnimation (jumbo) {
		return function (frame) {
			var d = frame.timeDiff;
			jumbo.time += d;
			if (jumbo.time >= 45000 * jumbo.half) {
				jumbo.time = 45000 * jumbo.half;
				jumbo.stopClock();
			}
			jumbo.updateClock();
		};
	}

	SoccerSlime.Jumbotron = function (game) {
		return new Jumbotron(game);
	};


}(jQuery));
