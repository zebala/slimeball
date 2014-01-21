(function ($) {

	var modes = {
		menu: 0,
		game: 1,
		goal: 2,
		continueGame: 3,
		halfTime: 4,
		gameOver: 5,
		test: 6
	};

	SoccerSlime.Mode = function (game) {
		var setMode = modes.menu;

		return function (mode) {
			if (typeof mode === "undefined") {
				for (var m in modes) {
					if (modes[m] === setMode) {
						return m;
					}
				}
			}
			if (typeof mode === "string") {
				for (var m in modes) {
					if (m === mode) {
						setMode = modes[m];
						if (setModeTo.hasOwnProperty(m)) {
							setModeTo[m](game);
						}
						return setMode;
					}
				}
			}
			if (typeof mode === "number") {
				setMode = mode;
				return setMode;
			}
			return undefined;
		};
	};

	var setModeTo = {
		menu: function (game) {
			game.gameInit();
			game.stage.menuLayer.setVisible(true);
			game.stage.continueLayer.setVisible(true);
			game.jumbotron.resetClock();
			game.jumbotron.stopClock();
			game.stage.obj.draw();
		},

		goal: function (game) {
			game.jumbotron.stopClock();
			game.stage.startTextAnimation("Goal!");
		},

		continueGame: function (game) {
			game.init();
			game.jumbotron.stopClock();
			game.stage.menuLayer.setVisible(false);
			game.stage.continueLayer.setVisible(true);
		},

		game: function (game) {
			game.jumbotron.startClock();
			game.stage.menuLayer.setVisible(false);
			game.stage.continueLayer.setVisible(false);
		},

		halfTime: function (game) {
			game.jumbotron.stopClock();
			if (game.jumbotron.time === 45000) {
				game.stage.startTextAnimation("Half-time");
			} else {
				if (game.teams[0].goals > game.teams[1].goals) {
					game.stage.startTextAnimation(game.teams[0].name + " wins!");
				} else if (game.teams[0].goals < game.teams[1].goals) {
					game.stage.startTextAnimation(game.teams[1].name + " wins!");
				} else {
					game.stage.startTextAnimation("Tie");
				}
			}
		},

		gameOver: function (game) {
			game.jumbotron.stopClock();
			game.stage.menuLayer.setVisible(false);
			game.stage.continueLayer.setVisible(true);
		}
	};


}(jQuery));
