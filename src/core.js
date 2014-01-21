(function($) {
	"use strict";

	var size = {
		width: 730,
		height: 375,
		groundHeight: 75,

		slimeRadius: 37,
		ballDiameter: 22,
		ballRadius: 11,
		goalHeight: 15*5,
		goalWidth: 8*5
	};

	var speed = {
		slime: 300,//360,//px/s
		jump: 325,//780,//px/s
		ballMaxSpeed: 750,//900,//px/s
		gravity: 1250//3600 //px/s^2
	};

	var direction = {
		left : - 1,
		right : 1
	};

	/**
	 * Creates a game object and initializes the game
	 * @param  {object} options Options for changing the default sizes and speeds.
	 * @return {undefined}
	 */
	var Game = function (options) {
		options = $.extend({}, {size: size, speed: speed}, options);
		this.size = options.size;
		this.speed = options.speed;
		this.direction = direction;
		this.stage = SoccerSlime.Stage(this);
		this.ball = SoccerSlime.Ball(this);
		this.teams = [];
		this.slimes = [];
		this.teams.push(
			SoccerSlime.Team(this, "Red", "#FF0000", "left")
				.addPlayer({up: "w", left: "a", right: "d"})
			);
		this.teams.push(
			SoccerSlime.Team(this, "Green", "#009900", "right")
				.addPlayer({up: "up", left: "left", right: "right"})
			);
		this.jumbotron = SoccerSlime.Jumbotron(this);
		this.keys = SoccerSlime.Keys(this);
		this.mode = SoccerSlime.Mode(this);
		this.updater = SoccerSlime.Updater(this);
		this.init();
	};

	Game.prototype.gameInit = function () {
		this.teams[0].gameInit();
		this.teams[1].gameInit();
		this.ball.init();
		this.jumbotron.init();
	};

	Game.prototype.init = function () {
		this.teams[0].init();
		this.teams[1].init();
		this.ball.init();
	};

	if (window) {
		window.SoccerSlime = {};
		window.SoccerSlime.Game = function (options) {
			return new Game(options);
		};
	}

}(jQuery));
