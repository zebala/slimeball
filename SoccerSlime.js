size = {
	width: 730,
	height: 375,
	groundHeight: 75,

	slimeRadius: 37,
	ballDiameter: 22,
	ballRadius: 11,
	goalHeight: 15*5,
	goalWidth: 8*5
}

speed = {
	slime: 300,//360,//px/s
	jump: 325,//780,//px/s
	ballMaxSpeed: 750,//900,//px/s
	gravity: 1250//3600 //px/s^2
}

direction = {
	left : - 1,
	right : 1
}

drawShapes = {
	drawSlime : function() {
		var context = this.getContext();
			
		context.beginPath();
		context.arc(0, 0, size.slimeRadius, 0, Math.PI, true);
		context.closePath();
		var grd = context.createRadialGradient( 0, -size.slimeRadius, 0, 0, -size.slimeRadius, size.slimeRadius);
		grd.addColorStop(0, '#FFFFFF');
		grd.addColorStop(1, this.color);
		context.fillStyle = grd;
		context.fill();

		//draw eyes
		var eyeRadius = size.slimeRadius / 5;
		context.beginPath();
		context.arc((size.slimeRadius - eyeRadius)/Math.sqrt(2) * this.direction, - (size.slimeRadius - eyeRadius)/Math.sqrt(2), eyeRadius, 0, 2 * Math.PI, true);
		context.fillStyle = 'white';
		context.fill();
		//calculate the angle of the eyeball
		var d_y = this.ball.getY() - this.getY() + (size.slimeRadius - eyeRadius)/Math.sqrt(2);
		var d_x = this.ball.getX() - this.getX() - (size.slimeRadius - eyeRadius)/Math.sqrt(2) * this.direction;
		var angle = Math.atan2(d_y, d_x);
		context.beginPath();
		context.arc((size.slimeRadius - eyeRadius)/Math.sqrt(2) * this.direction + eyeRadius / 2 * Math.cos(angle), - (size.slimeRadius - eyeRadius)/Math.sqrt(2) + eyeRadius / 2 * Math.sin(angle), eyeRadius / 2, 0, 2 * Math.PI, true);
		context.fillStyle = 'black';
		context.fill();
		// context.lineWidth = 1
		// context.strokeStyle = '#000000';
		// context.stroke();
	}
}


//GLOBAL VARAIBLES
var slimes = new Array();
var players = 2;
var ball;

//KEYS
var keyStatus = new Object();
var gameKeys = [ "left", "right" , "up", "space", "w", "a", "d" ];
var keyMap = { "left" : 37, "right" : 39, "up" : 38 , "space" : 32, "w" : 87, "a" : 65, "d" : 68};
function checkKey(key) {
    for(var i = 0; i < gameKeys.length ; i++)
    {
        if(keyMap[gameKeys[i]]==key)
            return true;
    }
}
function keyDown(key) {
	if (checkKey(key)) {
		keyStatus[key] = true;
	}
}
function keyUp(key) {
	if (checkKey(key)) {
		keyStatus[key] = false;
	}
}
function isDown(keyString) {
	return keyStatus[keyMap[keyString]];
}


function init() {
	ball.setPosition(size.width/2, size.height - size.groundHeight - 150);
	ball.vx = 0;
	ball.vy = 0;

	for (var i = 0; i < players; i++) {
		if (i === 0) {
			slimes[i].setPosition(size.goalWidth + size.slimeRadius * 2, size.height - size.groundHeight);
			slimes[i].direction = direction.right;
		} else if (i === 1) {
			slimes[i].setPosition(size.width - size.goalWidth - size.slimeRadius * 2, size.height - size.groundHeight);
			slimes[i].direction = direction.left;
		}
		slimes[i].vx = 0;
		slimes[i].vy = 0;
	}
}

function updateGame(frame) {
	var d = frame.timeDiff;
	var time = frame.time;

	// UPDATE GAME
	updateSlimes(d);
	updateBall(d);

}

function updateSlimes(d) {
	for (var i = 0; i < players; i++) {
		//check keys and update velocities
		slimes[i].vx = 0;
		if (i === 0) {
			if (isDown("a")) {
				slimes[i].vx = -speed.slime;
				slimes[i].direction = direction.left;
			}
			if (isDown("d")) {
				slimes[i].vx = speed.slime;
				slimes[i].direction = direction.right;
			}
			if (isDown("w") && slimes[i].getY() === size.height - size.groundHeight) {
				slimes[i].vy = -speed.jump;
			}
		}
		if (i === 1) {
			if (isDown("left")) {
				slimes[i].vx = -speed.slime;
				slimes[i].direction = direction.left;
			}
			if (isDown("right")) {
				slimes[i].vx = speed.slime;
				slimes[i].direction = direction.right;
			}
			if (isDown("up") && slimes[i].getY() === size.height - size.groundHeight) {
				slimes[i].vy = -speed.jump;
			}
		}

		//move players
		slimes[i].setPosition(	Math.min( Math.max(slimes[i].getX() + slimes[i].vx * d / 1000, size.slimeRadius), size.width - size.slimeRadius),
								slimes[i].getY() + slimes[i].vy * d / 1000);

		//update velocities (gravity)
		if (slimes[i].getY() < size.height - size.groundHeight) {
			slimes[i].vy = slimes[i].vy + (speed.gravity * d) / 1000;
		} else {
			slimes[i].vy = 0;
			slimes[i].setPosition(slimes[i].getX(), size.height - size.groundHeight);
		}
	}
}

function updateBall(d) {
	var bx = ball.getX();
	var by = ball.getY();

	//direction of the ball
	var ang = Math.atan2(ball.vy, ball.vx);

	//slow down the ball and limit velocity
	var v = Math.min( Math.sqrt( Math.pow(ball.vx, 2) + Math.pow(ball.vy, 2) ), speed.ballMaxSpeed) * Math.pow(0.8, d / 1000);
	ball.vx = v * Math.cos(ang);
	ball.vy = v * Math.sin(ang);

	//move the ball
	bx += ball.vx * d / 1000;
	by += ball.vy * d / 1000;

	//gravity and boundary check
	if (by + size.ballRadius < size.height - size.groundHeight) {
		ball.vy += speed.gravity * d / 1000;
	} else {
		by = size.height - size.groundHeight - size.ballRadius;
		ball.vy = - ball.vy / 2;
	}

	if (bx < size.ballRadius) {
		bx = size.ballRadius + (size.ballRadius - bx) / 2;
		ball.vx = - ball.vx / 2;
	}
	if (bx > size.width - size.ballRadius) {
		bx = size.width - size.ballRadius - (size.width - size.ballRadius - bx) / 2;
		ball.vx = - ball.vx / 2;
	}

	//collision with slimes
	for (var i = 0; i < players; i++) {
		ang = Math.atan2(ball.vy, ball.vx);
		v = Math.min( Math.sqrt( Math.pow(ball.vx, 2) + Math.pow(ball.vy, 2) ), speed.ballMaxSpeed) * Math.pow(0.9, d / 1000);

		
		if (Math.sqrt( Math.pow(slimes[i].getX() - bx, 2) + Math.pow(slimes[i].getY() - by, 2) ) < size.slimeRadius + size.ballRadius && by < slimes[i].getY()) {
			//move ball outside of slime
			var ang2 = Math.atan2(by - slimes[i].getY(), bx - slimes[i].getX());
			var b = (bx - slimes[i].getX()) * Math.cos(-ang) + (by - slimes[i].getY()) * Math.sin(-ang);
			var c = - Math.pow(size.slimeRadius + size.ballRadius, 2) + Math.pow(bx, 2) - bx * slimes[i].getX() + Math.pow(slimes[i].getX(), 2) + Math.pow(by, 2) - by * slimes[i].getY() + Math.pow(slimes[i].getY(), 2);
			var dis = Math.pow(b, 2) - 4 * c;
			if (dis >= 0) {
				var l = (-b + Math.sqrt(dis)) / 2;
				bx = bx + l * cos(-ang);
				by = by + l * sin(-ang);
			} else {
				bx = slimes[i].getX() + (size.slimeRadius + size.ballRadius) * Math.cos(ang2);
				by = slimes[i].getY() + (size.slimeRadius + size.ballRadius) * Math.sin(ang2);
			}

			//update ang2
			ang2 = Math.atan2(by - slimes[i].getY(), bx - slimes[i].getX());

			ball.vx = v * Math.cos(2 * ang2 - ang + Math.PI);
			ball.vy = v * Math.sin(2 * ang2 - ang +Math.PI) - Math.sin(ang2) * Math.min(0, slimes[i].vy);
			if ((bx > slimes[i].getX() && slimes[i].vx > 0) || (bx < slimes[i].getX() && slimes[i].vx < 0))
				ball.vx += Math.abs(Math.cos(ang2)) * slimes[i].vx;
			if (bx < size.ballRadius) {
				bx = size.ballRadius + (size.ballRadius - bx) / 2;
				ball.vx = - ball.vx / 2;
			}
			if (bx > size.width - size.ballRadius) {
				bx = size.width - size.ballRadius - (size.width - size.ballRadius - bx) / 2;
				ball.vx = - ball.vx / 2;
			}
		}
	}
	ball.setPosition(bx, by);


}

//BEGINNING
$("document").ready( function() {
	
	var stage = new Kinetic.Stage({
		container: 'container',
		x: 0,
		y: 0,
		width: size.width,
		height: size.height
	});

	//LAYERS
	var backgroundLayer = new Kinetic.Layer();
	var gameLayer = new Kinetic.Layer();

	backgroundLayer.name = "background";
	gameLayer.name = "game";

	//DRAW BACKGROUND
	backgroundLayer.add(
		new Kinetic.Rect({
			x: 0,
			y:0,
			width: size.width,
			height: size.height,
			fillLinearGradientStartPoint: [0,0],
			fillLinearGradientEndPoint: [0, size.height],
			fillLinearGradientColorStops: [	0, 'white',
											(size.height - size.groundHeight) / size.height,'blue',
											(size.height - size.groundHeight + 1) / size.height, '#00C800',
											1, 'green']
		})
	);

	//ADD BALL
	ball = new Kinetic.Circle({
		radius: size.ballRadius,
		fillRadialGradientStartPoint: [size.ballRadius / 2, -size.ballRadius / 2],
		fillRadialGradientEndPoint: [0,0],
		fillRadialGradientStartRadius: size.ballRadius / 10,
		fillRadialGradientEndRadius: size.ballRadius,
		fillRadialGradientColorStops: [	0, 'yellow',
										1, '#FFCC00']
	});
	ball.vx = 0;
	ball.vy = 0;
	gameLayer.add(ball);


	//ADD SLIMES
	slimes = Array();
	for (var i = 0; i < players; i++) {
		var slime = new Kinetic.Shape({ drawFunc: drawShapes.drawSlime });
		if (i === 0) {
			slime.color = 'red';
			slime.direction = direction.right; 
		} else {
			slime.color = 'green';
			slime.direction = direction.left;
		}
		slime.vx = 0;
		slime.vy = 0;
		slime.ball = ball;
		slimes.push(slime);
		gameLayer.add(slime);
	};

	init();

	stage.add(backgroundLayer);
	stage.add(gameLayer);

	window.addEventListener('keydown', function(event){keyDown(event.keyCode)}, false);
	window.addEventListener('keyup', function(event){keyUp(event.keyCode)}, false);	

	var gameAnimation = new Kinetic.Animation(function(frame) {updateGame(frame)} , gameLayer);
	gameAnimation.start();

});
