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
			var spriteData = {
				images: ["resources/floorTiles2.png"],
				frames: [
		            // x, y, width, height, imageIndex, regX, regY
		            [0,0,32,32,0],
		            [0,32,32,32,0],
		            [0,64,32,32,0],
		            [0,96,32,32,0],
		            [0,128,32,32,0],
		            [0,160,32,32,0]
		    	],
				animations: {
				         brightFloor: 5,
				         yellowFloor: 2,
				         darkFloor: 3
				     }
			};

			floorSpriteSheet = new createjs.SpriteSheet(spriteData);
			return floorSpriteSheet;
		}
	}

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
	}

	self.getFloorSprite = function (animation) {

		var spriteSheet = self.floorSpriteSheet();
		var floorSprite = new createjs.Sprite(self.floorSpriteSheet(), animation);
		floorSprite.scaleX = 1.25;
		floorSprite.scaleY = 1.25;

		return floorSprite;
	}

	self.getPlayerSprite = function (animation) {
		var sprite = new createjs.Sprite(self.playerSpriteSheet(), animation);
		sprite.scaleX = .3077;
		sprite.scaleY = .3077;
		return sprite;
	}

}) ();