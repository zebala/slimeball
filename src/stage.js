(function ($) {

	var Stage = function (game) {
		this.game = game;
		this.init();
	};

	Stage.prototype.init = function () {
		var size = this.game.size;
		this.obj = new Kinetic.Stage({
			container: 'slimecontainer',
			x: 0,
			y: 0,
			width: size.width,
			height: size.height
		});
		this.gameLayer = new Kinetic.Layer();
		this.menuLayer = initMenuLayer(this.game);
		this.continueLayer = initContinueLayer(this.game);
		var scoreLayer = new Kinetic.Layer();
		this.bouncingText = initBouncingText(this.game);
		scoreLayer.add(this.bouncingText);

		this.obj.add(initBackgroundLayer(this.game));
		this.obj.add(this.gameLayer);
		this.obj.add(initGoalLayer(this.game));
		this.obj.add(this.menuLayer);
		this.obj.add(this.continueLayer);
		this.obj.add(scoreLayer);

		//makes container focusable
		$("#slimecontainer").attr("tabindex", "0");
		$("#slimecontainer").mousedown(
			function () {
				$(this).focus();
				return false;
			}
		);
		//hides outline of focus/selection
		$("#slimecontainer").css("outline", "none");
		return this;
	};

	function initBackgroundLayer(game) {
		var size = game.size;
		var layer = new Kinetic.Layer();
		layer.add( new Kinetic.Rect({
			x: 0,
			y: 0,
			width: size.width,
			height: size.height,
			fillLinearGradientStartPoint: [0,0],
			fillLinearGradientEndPoint: [0, size.height],
			fillLinearGradientColorStops: [ 0, 'white',
											(size.height - size.groundHeight) / size.height,'blue',
											(size.height - size.groundHeight + 1) / size.height, '#00C800',
											1, 'green']
		}));
		return layer;
	}

	function initGoalLayer(game) {
		var size = game.size;
		var layer = new Kinetic.Layer();
		layer.add( new Kinetic.Shape({
			drawFunc: function () {
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
				for (x = size.width - size.goalWidth; x <= size.width; x += 5) {
					context.moveTo(x - 0.5, size.height - size.groundHeight - size.goalHeight - 0.5);
					context.lineTo(x - 0.5, size.height - size.groundHeight);
				}
				//draw horizontal lines
				for (y = (size.height - size.groundHeight - size.goalHeight); y <= size.height - size.groundHeight; y += 5) {
					context.moveTo(size.width - size.goalWidth - 0.5, y - 0.5);
					context.lineTo(size.width, y - 0.5);
				}
				context.strokeStyle = "white";
				context.lineWidth = 1;
				context.stroke();
				//bars
				context.beginPath();
				context.rect(size.goalWidth - 4.5, size.height - size.groundHeight - size.groundHeight - 0.5, 5, size.goalHeight);
				context.rect(size.width - size.goalWidth - 0.5, size.height - size.groundHeight - size.groundHeight - 0.5, 5, size.goalHeight);
				//goal areas
				context.rect(0, size.height - size.groundHeight + 5, size.goalWidth + size.slimeRadius, 5);
				context.rect(size.width - size.goalWidth - size.slimeRadius, size.height - size.groundHeight + 5, size.goalWidth + size.slimeRadius, 5);
				context.fillStyle = "white";
				context.fill();
				context.stroke();
			}
		}));
		return layer;
	}

	function initMenuLayer(game) {
		var size = game.size;
		var layer = new Kinetic.Layer();
		layer.add( new Kinetic.Text({
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
		return layer;
	}

	function initContinueLayer(game) {
		var size = game.size;
		var layer = new Kinetic.Layer();
		layer.add( new Kinetic.Text({
			x: 0,
			y: size.height - size.groundHeight - 40,
			fontSize: 20,
			fontFamily: 'Arial',
			width: size.width,
			text: "Hit space to continue",
			fill: 'white',
			align: 'center'
		}));
		return layer;
	}

	function initBouncingText(game) {
		var size = game.size;
		var text = new Kinetic.Text({
			x: 0,
			y: -1000,
			fontSize: 150,
			fontFamily: 'Impact',
			width: size.width,
			text: 'Goal!',
			fill: 'white',
			align: 'center',
			shadowColor: 'black',
			shadowBlur: 0.1,
			shadowOffset: 7,
			shadowOpacity: 0.9
		});
		return text;
	}

	Stage.prototype.startTextAnimation = function (str) {
		var size = this.game.size,
			bouncingText = this.bouncingText;
		//Change the text
		bouncingText.setText(str);
		//positin text above the screen
		bouncingText.setPosition(0, -bouncingText.getTextHeight());
		//create transition
		new Kinetic.Tween({
			node: bouncingText,
			y: size.height - size.groundHeight - bouncingText.getTextHeight(),
			duration: 1.2,
			easing: Kinetic.Easings.BounceEaseOut,
			//swipe the bouncingText out
			onFinish: function() {
				new Kinetic.Tween({
					node: bouncingText,
					x: size.width,
					duration: 1.2,
					easing: Kinetic.Easings.EaseIn
				}).play();
			}
		}).play();
	};

	SoccerSlime.Stage = function (game) {
		return new Stage(game);
	};

}(jQuery));
