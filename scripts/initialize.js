/// <reference path="lobe.ts" />


	var KEYCODE_ENTER = 13;		//usefull keycode
	var KEYCODE_SPACE = 32;		//usefull keycode
	var KEYCODE_UP = 38;		//usefull keycode
	var KEYCODE_LEFT = 37;		//usefull keycode
	var KEYCODE_RIGHT = 39;		//usefull keycode
	var KEYCODE_DOWN = 40;		//usefull keycode
	var KEYCODE_W = 87;			//usefull keycode
	var KEYCODE_A = 65;			//usefull keycode
	var KEYCODE_D = 68;			//usefull keycode

	var room;
	var stage;
	var player;

	document.onkeydown = handleKeyDown;

function init() {
	Lobe = window.Lobe;
	Lobe.init();
			stage = new createjs.Stage("canvas");

		var redFigure = {
			create: function() {
				var shape = new createjs.Shape();
				shape.graphics.beginFill("#ff0000").drawRect(0,0, Lobe.tileW, Lobe.tileH);
				return shape;
			} 
		};

		var greyFigure = {
			create: function() {
				var shape = new createjs.Shape();
				shape.graphics.beginFill("#7777777").drawRect(0, 0, Lobe.tileW, Lobe.tileH);
				return shape;
			} 
		};

		Lobe.figures.put('redTile', redFigure);
		Lobe.figures.put('greyTile', greyFigure);
		room = new Lobe.Room(stage, Lobe.figures.get('redTile'));
		room.start = new Lobe.Point(0, 0);




		// draw grey tiles
		// for (var i = 0; i < ROOM_WIDTH; i++) {
		// 	for (var j = 0; j < ROOM_HEIGHT; j++) {
		// 		room.tileAt(i, j);
		// 	}
		// }

		// draw lines
		var line = new createjs.Shape();
		line.graphics.setStrokeStyle(2);
		line.graphics.beginStroke("black");
		for (var i = 0; i < Lobe.cols+1; i++) {
			for (var j = 0; j < Lobe.rows+1; j++) {
				line.graphics.moveTo(0, j * Lobe.tileH);
				line.graphics.lineTo(Lobe.tileW * Lobe.cols, j * Lobe.tileW);
			}
			line.graphics.moveTo(i * Lobe.tileH, 0);
			line.graphics.lineTo(i * Lobe.tileW, Lobe.tileH * Lobe.rows);
		}
		line.graphics.endStroke();
		stage.addChild(line);
		stage.update();

		// draw player
		// player = new createjs.Shape();
		// player.graphics.beginFill("black").drawCircle(10, 10, 10);
		// stage.addChild(player);

		// spritesheet
		var spriteData = {
			images: ["resources/marioSprites.png"],
			frames: [
	            // x, y, width, height, imageIndex, regX, regY
	            [0, 0,40,40,0],
	            [40,0,40,40,0],
	            [80,0,40,40,0],
	            [120,0,40,40,0]
        	],
			animations: {
			         stand: [0,1],
			         spinAround: [2,3],
			         wall: 3
			     }
		};

		// draw mario
 		var spriteSheet = new createjs.SpriteSheet(spriteData);
 		var sprite = new createjs.Sprite(spriteSheet, "stand");
 		sprite.x = 20;
 		sprite.y = 20;

 		// draw animated mario
 		var sprite2 = new createjs.Sprite(spriteSheet, "spinAround");
 		sprite2.x = 60;
 		sprite2.y = 20;

 		// wall mario
 		var sprite3 = new createjs.Sprite(spriteSheet, "wall");


		Lobe.player.replaceObject(sprite2);
		Lobe.player.moveToRoom(room);


		createjs.Ticker.addEventListener("tick", tick);
		var backwards = false;

		// set up callbacks for player movement
		room.onWallMove = function(p) {
			Lobe.player.replaceObject(sprite3);
		};
		room.onSuccessfulMove = function(p) { 
			if (backwards) {

				backwards = false;
				Lobe.player.replaceObject(sprite2);
			} else {
				backwards = true;
				Lobe.player.replaceObject(sprite);
			}


		};
		room.onOutOfBoundsMove = function(p) {
			Lobe.player.replaceObject(sprite3);
		};

}

	function tick(event) {
		stage.update(event);
	}

	function renderTile(x, y) {
		if (room[x][y] == '') {

		}
	}

	function handleKeyDown(e) {
	//cross browser issues exist
	if(!e){ var e = window.event; }
		switch(e.keyCode) {
			case KEYCODE_LEFT:	{
				Lobe.player.moveLeft();
				// player.x -= 20;
				e.preventDefault();
				break;
			}
			case KEYCODE_RIGHT: {
				Lobe.player.moveRight();
				//player.x += 20;	
				e.preventDefault();
				break;
			}
			case KEYCODE_UP:	{
				Lobe.player.moveUp();
				// player.y -= 20;	
				e.preventDefault();
				break;
			}
			case KEYCODE_DOWN:  {
				Lobe.player.moveDown();
				// player.y += 20;	
				e.preventDefault();
				break;
			}
		}
	}
