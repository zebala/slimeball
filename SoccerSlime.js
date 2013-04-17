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

mode = {
	menu: 0,
	game: 1,
	goal: 2,
	continueGame: 3,
	gameOver: 4,
	test: 5
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


//GLOBAL VARIABLES
var stage;
var menuLayer;
var continueLayer;
var scoreLayer;
var scoreText;

var players = 2;
var slimes;
var ball;
var goals = [0,0];

var team1Name = "Red";
var team2Name = "Green";
var teamName;

var gameMode = mode.menu;

//KEYS
var keyStatus = new Object();
var keyHitStatus = new Object();
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
		if (!keyStatus[key]) {
			keyHitStatus[key] = true;
		} else {
			keyHitStatus[key] = false;
		}
		keyStatus[key] = true;
	}
}
function keyUp(key) {
	if (checkKey(key)) {
		keyHitStatus[key] = false;
		keyStatus[key] = false;
	}
}
function isDown(keyString) {
	return keyStatus[keyMap[keyString]];
}
function isHit(keyString) {
	return keyHitStatus[keyMap[keyString]];
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

function masterInit() {
	init();
	goals[0] = 0;
	goals[1] = 0;
}

function updateGame(frame) {
	var d = frame.timeDiff;
	var time = frame.time;

	// UPDATE GAME
	switch(gameMode) {
		case mode.menu:
			if (isHit("space")) {
				setModeToGame();
			}
			break;
		case mode.game:
			updateSlimes(d);
			updateBall(d);
			checkGoal();
			break;
		case mode.goal:
			updateSlimes(d);
			updateBall(d);
			break;
		case mode.continueGame:
			if (isHit("space")) {
				setModeToGame();
			}
			break;
		case mode.gameOver:	
			
			break;
		case mode.test:
			updateSlimes(d);
			updateBall(d);
			break;	
	}
}

function updateSlimes(d) {
	for (var i = 0; i < players; i++) {
		//check keys and update velocities
		slimes[i].vx = 0;
		if (gameMode === mode.game || gameMode === mode.test) {
			if (i === 0) {
				if (isDown("a")) {
					slimes[i].vx = -speed.slime;
					slimes[i].direction = direction.left;
				}
				if (isDown("d")) {
					slimes[i].vx = speed.slime;
					slimes[i].direction = direction.right;
				}
				if (isHit("w") && slimes[i].getY() === size.height - size.groundHeight) {
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
				if (isHit("up") && slimes[i].getY() === size.height - size.groundHeight) {
					slimes[i].vy = -speed.jump;
				}
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
	var old_bx = bx;
	var old_by = by;

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
		v = Math.min( Math.sqrt( Math.pow(ball.vx, 2) + Math.pow(ball.vy, 2) ), speed.ballMaxSpeed);

		
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
			ball.vy = v * Math.sin(2 * ang2 - ang +Math.PI) - Math.sin(ang2) * 2 * Math.min(0, slimes[i].vy);
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
	
	//collision with goal
	if (	
			by + size.ballRadius > size.height - size.groundHeight - size.goalHeight && 			old_by + size.ballRadius <= size.height - size.groundHeight - size.goalHeight &&
	 		(bx < size.goalWidth || bx > size.width - size.goalWidth)
	 	) {
	 	by = size.height - size.groundHeight - size.goalHeight - size.ballRadius;
		ball.vy = - ball.vy / 2;
		ball.vx += (bx < size.width/2 ? 1: -1)* 5 * d / 1000;
	}
	if (	
			by - size.ballRadius < size.height - size.groundHeight - size.goalHeight && 			old_by - size.ballRadius >= size.height - size.groundHeight - size.goalHeight &&
	 		(bx < size.goalWidth || bx > size.width - size.goalWidth)
	 	) {
	 	by = size.height - size.groundHeight - size.goalHeight + size.ballRadius;
		ball.vy = - ball.vy / 2;
	}
	//collision with goal bar
	//TODO: improve
	if (Math.sqrt( Math.pow(size.goalWidth - bx, 2) + Math.pow(size.height - size.groundHeight - size.goalHeight - by, 2)) <= size.ballRadius) {
		var ang = Math.atan2(ball.vy, ball.vx);
		ball.vx = Math.abs(ball.vx);
		ball.vy *= -1;
	}
	if (Math.sqrt( Math.pow(size.width - size.goalWidth - bx, 2) + Math.pow(size.height - size.groundHeight - size.goalHeight - by, 2)) <= size.ballRadius) {
		var ang = Math.atan2(ball.vy, ball.vx);
		ball.vx = - Math.abs(ball.vx);
		ball.vy *= -1;
	}
	
	ball.setPosition(bx, by);
}

function checkGoal() {
	if ((ball.getX() < size.goalWidth) && (ball.getY() > size.height - size.groundHeight - size.goalHeight)) {
		teamName[1].setText(team2Name + ": " + ++goals[1]);
		teamName[1].setX(size.width - 20 - teamName[1].getWidth()); 	//update position
		stage.draw(); 													// refreshes the layers, including jumboTronLayer
		setModeToGoal();
		setTimeout(	function(){setModeToContinue()}, 1500);
	}
	if ((ball.getX() > (size.width - size.goalWidth)) && (ball.getY() > size.height - size.groundHeight - size.goalHeight)) {
		teamName[0].setText(team1Name + ": " + ++goals[0]);
		stage.draw(); 													// refreshes the layers, including jumboTronLayer
		setModeToGoal();
		setTimeout(	function(){setModeToContinue()}, 1500);
	}
}

function setModeToMenu() {
	gameMode = mode.menu;
	init();
	menuLayer.setVisible(true);
	continueLayer.setVisible(true);
	stage.draw();
}

function setModeToGoal() {
	transitionGoalTextIn();
	gameMode = mode.goal;
}

function setModeToContinue() {
	gameMode = mode.continueGame;
	init();
	scoreText.setX(-150);
	menuLayer.setVisible(false);
	continueLayer.setVisible(true);
	stage.draw();					// refresh the layers
}

function setModeToGame() {
	gameMode = mode.game;
	menuLayer.setVisible(false);
	continueLayer.setVisible(false);
	//stage.draw();
}

function transitionGoalTextIn() {
	//set position to the left side of the screen
	scoreText.setX(- scoreText.getWidth());
	//create transition
	scoreText.transitionTo({
	    x: size.width / 2 - scoreText.getWidth(),
	    duration: 1,
	    easing: 'ease-out',
	    //transition out
	    callback: function () {
	    	scoreText.transitionTo({
	    		x: size.width,
	    		duration: 1,
	    		easing: 'ease-in'
	    	});
	    }
	});
}

//BEGINNING
$("document").ready( function() {
	
	stage = new Kinetic.Stage({
		container: 'container',
		x: 0,
		y: 0,
		width: size.width,
		height: size.height
	});

	//LAYERS
	var backgroundLayer = new Kinetic.Layer();
	var gameLayer = new Kinetic.Layer();
	var goalLayer = new Kinetic.Layer();
	var jumboTronLayer = new Kinetic.Layer();
	scoreLayer = new Kinetic.Layer();
	menuLayer = new Kinetic.Layer();
	continueLayer = new Kinetic.Layer();

	/* NOT USED
	backgroundLayer.setId("background");
	gameLayer.setId("game");
	goalLayer.setId("goals");
	jumboTronLayer.setId("jumboTron");
	menuLayer.setId("menu");
	continueLayer.setId("continue");
	scoreLayer.setId("score")
	*/

	//DRAW BACKGROUND
	backgroundLayer.add(
		new Kinetic.Rect({
			x: 0,
			y: 0,
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

	//DRAW GOALS
	goalLayer.add( new Kinetic.Shape({
		drawFunc: function(){
			var context = this.getContext();
			context.beginPath();
			//LEFT GOAL
			//draw vertical lines
			for (var x = 0; x <= size.goalWidth; x += 5) {
				context.moveTo(x + 0.5, size.height - size.groundHeight - size.goalHeight - 0.5);
				context.lineTo(x + 0.5, size.height - size.groundHeight);
			}
			//draw horizontal lines
			for (var y = (size.height - size.groundHeight - size.goalHeight); y <= size.height - size.groundHeight; y += 5) {
	  			context.moveTo(0.5, y - 0.5);
	  			context.lineTo(size.goalWidth + 0.5, y - 0.5);
			}
			
			//RIGHT GOAL
			//draw vertical lines
			for (var x = size.width - size.goalWidth; x <= size.width; x += 5) {
				context.moveTo(x - 0.5, size.height - size.groundHeight - size.goalHeight - 0.5);
				context.lineTo(x - 0.5, size.height - size.groundHeight);
			}
			//draw horizontal lines
			for (var y = (size.height - size.groundHeight - size.goalHeight); y <= size.height - size.groundHeight; y += 5) {
	  			context.moveTo(size.width - size.goalWidth - 0.5, y - 0.5);
	  			context.lineTo(size.width, y - 0.5);
			}
			context.strokeStyle = "white";
			context.lineWidth = 1;
			context.stroke();
		}
	}));

	//ADD BALL
	ball = new Kinetic.Circle({
		radius: size.ballRadius,
		fillRadialGradientStartPoint: [size.ballRadius / 2, -size.ballRadius / 2],
		fillRadialGradientEndPoint: [0,0],
		fillRadialGradientStartRadius: size.ballRadius / 10,
		fillRadialGradientEndRadius: size.ballRadius,
		fillRadialGradientColorStops: [	0, 'yellow',
										1, '#FFCC00'],
		draggable: true
	});
	ball.vx = 0;
	ball.vy = 0;
	gameLayer.add(ball);


	//ADD SLIMES
	slimes = Array(players);
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
		slimes[i] = slime;
		gameLayer.add(slime);
	};
	
	//ADD BAR
	jumboTronLayer.add(
		new Kinetic.Rect({
			x: 0,
			y: 0,
			width: size.width,
			height: 75,
			fill: 'black',
			opacity: 0.7
		})
	);

	teamName = Array(2);
	for (var i = 0; i < 2; i++) {
		teamName[i] = new Kinetic.Text({
			y: 20,
			fontSize: 25,
			fontFamily: 'Arial',
			fill: 'white'
		});
		if (i === 0) {
			teamName[i].setText(team1Name + ": 0");
			teamName[i].setX(20);
		} else {
			teamName[i].setText(team2Name + ": 0");
			teamName[i].setX(size.width - 20 - teamName[i].getWidth());
		}
		jumboTronLayer.add(teamName[i]);
	}
	
	scoreText = new Kinetic.Text({
		x: 0,
		y: 100,
		fontSize: 50,
		fontFamily: 'Impact',
		text: 'Goal!',
		fill: 'white',
		shadowColor: 'black',
        shadowBlur: 0.1,
        shadowOffset: 7,
        shadowOpacity: 0.9
	});
	// position text outside of the screen
	scoreText.setX(size.width);
	
	scoreLayer.add(scoreText);
	
	menuLayer.add( new Kinetic.Text({
		x: 0,
		y: size.height / 2 - 40,
		fontSize: 85,
		fontFamily: 'Impact',
		width: size.width,
		text: "HTML5 Soccer Slime",
		fill: 'white',
		align: 'center',
		// stroke: 'black',
        // strokeWidth: 2,
        shadowColor: 'black',
        shadowBlur: 0.1,
        shadowOffset: 7,
        shadowOpacity: 0.9
	}));

	continueLayer.add( new Kinetic.Text({
		x: 0,
		y: size.height - size.groundHeight - 40,
		fontSize: 20,
		fontFamily: 'Arial',
		width: size.width,
		text: "Hit space to continue",
		fill: 'white',
		align: 'center'
	}));

	setModeToMenu();

	init();

	stage.add(backgroundLayer);
	stage.add(gameLayer);
	stage.add(goalLayer);
	stage.add(jumboTronLayer);
	stage.add(menuLayer);
	stage.add(continueLayer);
	stage.add(scoreLayer);

	window.addEventListener('keydown', function(event){keyDown(event.keyCode)}, false);
	window.addEventListener('keyup', function(event){keyUp(event.keyCode)}, false);	

	var gameAnimation = new Kinetic.Animation(function(frame) {updateGame(frame)} , gameLayer);
	gameAnimation.start();

});
