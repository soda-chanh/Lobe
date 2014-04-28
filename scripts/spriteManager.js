(function() {
	window.lobe = window.lobe || {};
	window.lobe.SpriteManager = {};
	var self = window.lobe.SpriteManager;

	var floorSpriteSheet;
	var playerSpriteSheet;

	self.floorSpriteSheet = function() {
		if (floorSpriteSheet) {
			return floorSpriteSheet;
		} else {
			var frames = [];
			var animations = {};
			for (var l=0; l < 6; l++) {
				for (var j=0; j < 8; j++) {
					frames[l * 8 + j] = [j * 32, l * 32, 32, 32, 0];
				}
			}
			console.log(frames);
			animations.brightFloor = 5;
			animations.yellowFloor = 2;
			animations.darkFloor = 3;
			for (var k=0; k < 48; k++) {
				animations["tile" + k.toString()] = k;
			}
			var spriteData = {
				images: ["resources/floorTiles2.png"],
				frames: frames,
				animations: animations
			};

			floorSpriteSheet = new createjs.SpriteSheet(spriteData);
			return floorSpriteSheet;
		}
	};

	self.playerSpriteSheet = function() {
		if (playerSpriteSheet) {
			return playerSpriteSheet;
		} else {
			var spriteData = {
				images: ["resources/frogSprites.png"],
				frames: [
		            // x, y, width, height, imageIndex, regX, regY
		            [0, 0,130,130,0],
		            [0,0,40,40,0],
		            [80,0,40,40,0],
		            [120,0,40,40,0]
		    	],
				animations: {
				         stand: [0],
				         spinAround: [2,3],
				         wall: 3
				     }
			};

			playerSpriteSheet = new createjs.SpriteSheet(spriteData);
			return playerSpriteSheet;
		}
	};
	self.registerTiles = function () {
		var s = "tile"; 
		for (var p=0; p < 48; p++) {
			(function (j) {
				window.Lobe.figures.put('tile' + j.toString(),
					self.getFloorFigure('tile' + j.toString()));
				})(p);
		}
	};
	self.getFloorFigure = function (str) {
		var s = str;
		return {create: function () {
			return self.getFloorSprite(s);
		}};
	};

	self.getFloorSprite = function (animation) {
		var spriteSheet = self.floorSpriteSheet();
		var floorSprite = new createjs.Sprite(self.floorSpriteSheet(), animation);
		floorSprite.scaleX = 1.25;
		floorSprite.scaleY = 1.25;

		return floorSprite;
	};

	self.getPlayerSprite = function (animation) {
		var sprite = new createjs.Sprite(self.playerSpriteSheet(), animation);
		sprite.scaleX = .3077;
		sprite.scaleY = .3077;
		return sprite;
	};

}) ();
