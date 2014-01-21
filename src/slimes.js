(function ($) {
	"use strict";

	var direction = {
		left : - 1,
		right : 1
	};

	function drawSlime(slime) {

		return function () {
			var context = this.getContext();
			var size = slime.game.size;

			context.beginPath();
			context.arc(0, 0, size.slimeRadius, 0, Math.PI, true);
			context.closePath();
			var grd = context.createRadialGradient( 0, -size.slimeRadius, 0, 0, -size.slimeRadius, size.slimeRadius);
			grd.addColorStop(0, '#FFFFFF');
			grd.addColorStop(1, slime.color);
			context.fillStyle = grd;
			context.fill();

			//draw eyes
			var eyeRadius = size.slimeRadius / 5;
			context.beginPath();
			context.arc((size.slimeRadius - eyeRadius)/Math.sqrt(2) * slime.direction, - (size.slimeRadius - eyeRadius)/Math.sqrt(2), eyeRadius, 0, 2 * Math.PI, true);
			context.fillStyle = 'white';
			context.fill();
			//calculate the angle of the eyeball
			var d_y = slime.ball.obj.getY() - slime.obj.getY() + (size.slimeRadius - eyeRadius)/Math.sqrt(2);
			var d_x = slime.ball.obj.getX() - slime.obj.getX() - (size.slimeRadius - eyeRadius)/Math.sqrt(2) * slime.direction;
			var angle = Math.atan2(d_y, d_x);
			context.beginPath();
			context.arc((size.slimeRadius - eyeRadius)/Math.sqrt(2) * slime.direction + eyeRadius / 2 * Math.cos(angle), - (size.slimeRadius - eyeRadius)/Math.sqrt(2) + eyeRadius / 2 * Math.sin(angle), eyeRadius / 2, 0, 2 * Math.PI, true);
			context.fillStyle = 'black';
			context.fill();
			// context.lineWidth = 1
			// context.strokeStyle = '#000000';
			// context.stroke();
		};
	}

	var Slime = function (game, color, keys) {
		this.game = game;
		this.color = color;
		this.ball = game.ball;
		this.direction = direction.right;
		this.keys = keys;
		this.obj = new Kinetic.Shape({ drawFunc: drawSlime(this) });
		game.stage.gameLayer.add(this.obj);
		this.init();
	};

	Slime.prototype.init = function () {
		var size = this.game.size;
		this.vx = 0;
		this.vy = 0;
		return this;
	};

	Slime.prototype.update = function (d) {
		var k = this.game.keys;
		var size = this.game.size;
		var speed = this.game.speed;
		var direction = this.game.direction;

		this.vx = 0;

		if (k.isDown(this.keys.left)) {
			this.vx = -speed.slime;
			this.direction = direction.left;
		}
		if (k.isDown(this.keys.right)) {
			this.vx = speed.slime;
			this.direction = direction.right;
		}
		if (k.isHit(this.keys.up) && this.obj.getY() === size.height - size.groundHeight) {
			this.vy = -speed.jump;
		}

		//move players
		this.obj.setPosition(	Math.min( Math.max(this.obj.getX() + this.vx * d / 1000, size.slimeRadius), size.width - size.slimeRadius),
								this.obj.getY() + this.vy * d / 1000);

		//update velocities (gravity)
		if (this.obj.getY() < size.height - size.groundHeight) {
			this.vy = this.vy + (speed.gravity * d) / 1000;
		} else {
			this.vy = 0;
			this.obj.setPosition(this.obj.getX(), size.height - size.groundHeight);
		}
		return this;
	};

	SoccerSlime.Slime = function (game, ball, color) {
		return new Slime(game, ball, color);
	};

}(jQuery));
