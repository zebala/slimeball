(function ($) {
	"use strict";

	var Ball = function (game) {
		var size = game.size;
		this.obj = new Kinetic.Circle({
			radius: size.ballRadius,
			fillRadialGradientStartPoint: [size.ballRadius / 2, -size.ballRadius / 2],
			fillRadialGradientEndPoint: [0,0],
			fillRadialGradientStartRadius: size.ballRadius / 10,
			fillRadialGradientEndRadius: size.ballRadius,
			fillRadialGradientColorStops: [	0, 'yellow',
											1, '#FFCC00']
		});
		this.game = game;
		this.game.stage.gameLayer.add(this.obj);
		this.init();
	};

	Ball.prototype.init = function () {
		var size = this.game.size;
		this.vx = 0;
		this.vy = 0;
		this.obj.setPosition(size.width / 2, size.height - size.groundHeight - 0.4 * size.height);
		return this;
	};

	Ball.prototype.update = function (d) {
		var bx = this.obj.getX();
		var by = this.obj.getY();
		var old_bx = bx;
		var old_by = by;
		var size = this.game.size;
		var speed = this.game.speed;

		//direction of the this
		var ang = Math.atan2(this.vy, this.vx);

		//slow down the this and limit velocity
		var v = Math.min( Math.sqrt( Math.pow(this.vx, 2) + Math.pow(this.vy, 2) ), speed.ballMaxSpeed) * Math.pow(0.8, d / 1000);
		this.vx = v * Math.cos(ang);
		this.vy = v * Math.sin(ang);

		//move the this
		bx += this.vx * d / 1000;
		by += this.vy * d / 1000;

		//gravity and boundary check
		if (by + size.ballRadius < size.height - size.groundHeight) {
			this.vy += speed.gravity * d / 1000;
		} else {
			by = size.height - size.groundHeight - size.ballRadius;
			this.vy = - this.vy / 2;
		}

		if (bx < size.ballRadius) {
			bx = size.ballRadius + (size.ballRadius - bx) / 2;
			this.vx = - this.vx / 2;
		}
		if (bx > size.width - size.ballRadius) {
			bx = size.width - size.ballRadius - (size.width - size.ballRadius - bx) / 2;
			this.vx = - this.vx / 2;
		}

		//collision with slimes
		var players = this.game.slimes;
		for (var i = 0; i < players.length; i++) {
			ang = Math.atan2(this.vy, this.vx);
			v = Math.min( Math.sqrt( Math.pow(this.vx, 2) + Math.pow(this.vy, 2) ), speed.ballMaxSpeed);

			if (Math.sqrt( Math.pow(players[i].obj.getX() - bx, 2) + Math.pow(players[i].obj.getY() - by, 2) ) < size.slimeRadius + size.ballRadius && by < players[i].obj.getY()) {
				//move this outside of slime
				var ang2 = Math.atan2(by - players[i].obj.getY(), bx - players[i].obj.getX());
				var b = (bx - players[i].obj.getX()) * Math.cos(-ang) + (by - players[i].obj.getY()) * Math.sin(-ang);
				var c = - Math.pow(size.slimeRadius + size.ballRadius, 2) + Math.pow(bx, 2) - bx * players[i].obj.getX() + Math.pow(players[i].obj.getX(), 2) + Math.pow(by, 2) - by * players[i].obj.getY() + Math.pow(players[i].obj.getY(), 2);
				var dis = Math.pow(b, 2) - 4 * c;
				if (dis >= 0) {
					var l = (-b + Math.sqrt(dis)) / 2;
					bx = bx + l * cos(-ang);
					by = by + l * sin(-ang);
				} else {
					bx = players[i].obj.getX() + (size.slimeRadius + size.ballRadius) * Math.cos(ang2);
					by = players[i].obj.getY() + (size.slimeRadius + size.ballRadius) * Math.sin(ang2);
				}

				//update ang2
				ang2 = Math.atan2(by - players[i].obj.getY(), bx - players[i].obj.getX());

				//length of the velocity components
				var l1 = Math.cos(ang2) * this.vx + Math.sin(ang2) * this.vy;
				var l2 = Math.cos(ang2 + Math.PI / 2) * this.vx + Math.sin(ang2 + Math.PI / 2) * this.vy;
				var c1x = Math.cos(ang2) * l1;
				var c1y = Math.sin(ang2) * l1;
				var c2x = Math.cos(ang2) * l2;
				var c2y = Math.sin(ang2) * l2;
				this.vx = -c1x - c2x;
				this.vy = -c1y - c2y;
				// this.vx = v * Math.cos(2 * ang2 - ang + Math.PI);
				// this.vy = v * Math.sin(2 * ang2 - ang +Math.PI) - Math.sin(ang2) * 2 * Math.min(0, players[i].vy);
				if ((bx > players[i].obj.getX() && players[i].vx > 0) || (bx < players[i].obj.getX() && players[i].vx < 0))
					this.vx += Math.abs(Math.cos(ang2)) * players[i].vx;
				if (bx < size.ballRadius) {
					bx = size.ballRadius + (size.ballRadius - bx) / 2;
					this.vx = - this.vx / 2;
				}
				if (bx > size.width - size.ballRadius) {
					bx = size.width - size.ballRadius - (size.width - size.ballRadius - bx) / 2;
					this.vx = - this.vx / 2;
				}
			}
		}

		//collision with goal
		if (
				by + size.ballRadius > size.height - size.groundHeight - size.goalHeight &&
				old_by + size.ballRadius <= size.height - size.groundHeight - size.goalHeight &&
				(bx < size.goalWidth || bx > size.width - size.goalWidth)
			) {
			by = size.height - size.groundHeight - size.goalHeight - size.ballRadius;
			this.vy = - this.vy / 2;
			this.vx += (bx < size.width/2 ? 1: -1)* 5 * d / 1000;
		}
		if (
				by - size.ballRadius < size.height - size.groundHeight - size.goalHeight &&
				old_by - size.ballRadius >= size.height - size.groundHeight - size.goalHeight &&
				(bx < size.goalWidth || bx > size.width - size.goalWidth)
			) {
			by = size.height - size.groundHeight - size.goalHeight + size.ballRadius;
			this.vy = - this.vy / 2;
		}
		//collision with goal bar
		//TODO: improve
		if (Math.sqrt( Math.pow(size.goalWidth - bx, 2) + Math.pow(size.height - size.groundHeight - size.goalHeight - by, 2)) <= size.ballRadius) {
			ang = Math.atan2(this.vy, this.vx);
			this.vx = Math.abs(this.vx);
			this.vy *= -1;
		}
		if (Math.sqrt( Math.pow(size.width - size.goalWidth - bx, 2) + Math.pow(size.height - size.groundHeight - size.goalHeight - by, 2)) <= size.ballRadius) {
			ang = Math.atan2(this.vy, this.vx);
			this.vx = - Math.abs(this.vx);
			this.vy *= -1;
		}

		this.obj.setPosition(bx, by);
		return this;
	};

	SoccerSlime.Ball = function (game) {
		return new Ball(game);
	};

}(jQuery));
