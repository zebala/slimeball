(function ($) {

	var Updater = function (game) {
		this.game = game;
		this.animation = new Kinetic.Animation(updateGame(game), game.stage.gameLayer);
		this.animation.start();
	};

	var updateGame = function (game) {
		return function (frame) {
			var d = frame.timeDiff;
			var time = frame.time;
			var mode = game.modes;

			// UPDATE GAME
			switch(game.mode()) {
				case "menu":
					if (game.keys.isHit("space")) {
						game.mode("game");
					}
					break;
				case "game":
					updateSlimes(game, d);
					game.ball.update(d);
					checkGoal(game);
					checkEndOfHalf(game);
					break;
				case "goal":
					updateSlimes(game, d);
					game.ball.update(d);
					break;
				case "continueGame":
					if (game.keys.isHit("space")) {
						game.mode("game");
					}
					break;
				case "halfTime":
					updateSlimes(game, d);
					game.ball.update(d);
					break;
				case "gameOver":
					updateSlimes(game, d);
					game.ball.update(d);
					if (game.keys.isHit("space")) {
						setTimeout( function () { game.mode("menu"); }, 100);
					}
					break;
				case "test":
					updateSlimes(game, d);
					game.ball.update(d);
					break;
			}
		};
	};

	var updateSlimes = function (game, d) {
		for (var i = 0; i < game.slimes.length; i++) {
			game.slimes[i].update(d);
		}
	};

	var checkGoal = function (game) {
		var ball = game.ball;
		var size = game.size;
		var teamNum;
		if ((ball.obj.getX() < size.goalWidth) && (ball.obj.getY() > size.height - size.groundHeight - size.goalHeight)) {
			teamNum = 1;
		}
		if ((ball.obj.getX() > (size.width - size.goalWidth)) && (ball.obj.getY() > size.height - size.groundHeight - size.goalHeight)) {
			teamNum = 0;
		}
		if (typeof teamNum !== "undefined") {
			game.teams[teamNum].score();
			game.jumbotron.updateTeam(teamNum);
			game.stage.obj.draw(); // refreshes the layers, including jumbotron
			game.mode("goal");
			setTimeout(	function () { game.mode("continueGame"); }, 1500);
		}
	};

	var checkEndOfHalf = function (game) {
		jumbo = game.jumbotron;
		if (jumbo.time === 45000 * jumbo.half) {
			jumbo.setHalf(2);
			game.mode("halfTime");
			setTimeout(
				function () {
					if (jumbo.time === 45000) {
						game.mode("continueGame");
					} else {
						game.mode("gameOver");
					}
				},
				1500
			);
		}
	};

	SoccerSlime.Updater = function (game) {
		return new Updater(game);
	};

}(jQuery));
