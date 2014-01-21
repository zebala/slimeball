(function ($) {

	var direction = {
		left : - 1,
		right : 1
	};

	var Team = function (game, name, color, side) {
		this.game = game;
		this.name = name;
		this.color = color;
		this.direction = side.toLowerCase() === "right"? direction.left: direction.right;
		this.slimes = [];
		this.goals = 0;
	};

	Team.prototype.addPlayer = function (keys) {
		var slime = SoccerSlime.Slime(this.game, this.color, keys);
		this.slimes.push(slime);
		this.game.slimes.push(slime);
		return this;
	};

	Team.prototype.gameInit = function () {
		this.init();
		this.goals = 0;
		return this;
	};

	Team.prototype.init = function () {
		var size = this.game.size;
		var firstPos = (this.direction === direction.right? 0: size.width) + this.direction * ( size.goalWidth + size.slimeRadius * 2);
		for (var i = 0; i < this.slimes.length; i++) {
			var slime = this.slimes[i];
			slime.obj.setPosition(firstPos + (size.width / 2 - firstPos - size.slimeRadius) / (Math.max(1, this.slimes.length - 1)) * i, size.height - size.groundHeight);
			slime.direction = this.direction;
			slime.init();
		}
		return this;
	};

	Team.prototype.score = function () {
		this.goals += 1;
	};

	SoccerSlime.Team = function (game, name, color, side) {
		return new Team(game, name, color, side);
	};

}(jQuery));
