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
			stage = new createjs.Stage("canvas");

		var redFigure = {
			create: function() {
				var shape = new createjs.Shape();
				shape.graphics.beginFill("#ff0000").drawRect(0,0, 20, 20);
				return shape;
			} 
		};

		var greyFigure = {
			create: function() {
				var shape = new createjs.Shape();
				shape.graphics.beginFill("#7777777").drawRect(0, 0, 20, 20);
				return shape;
			} 
		};

		Lobe.figures.put('redTile', redFigure);
		Lobe.figures.put('greyTile', greyFigure);
		room = new Lobe.Room(stage, Lobe.figures.get('redTile'));




		// // draw background
		// for (var i = 0; i<40; i++){
		// 	for (var j = 0 ; j < 30; j++) {
		// 		var shape = new createjs.Shape();
 	// 			shape.graphics.beginFill("#ff0000").drawRect(i * 20,j * 20, 20, 20);
		// 		stage.addChild(shape);
		// 	}
		// }

		// draw lines
		var line = new createjs.Shape();
		line.graphics.setStrokeStyle(2);
		line.graphics.beginStroke("black");
		for (var i = 0; i < 40; i++) {
			for (var j = 0; j < 30; j++) {
				line.graphics.moveTo(0, j * 20);
				line.graphics.lineTo(800, j * 20);
			}
			line.graphics.moveTo(i * 20, 0);
			line.graphics.lineTo(i * 20, 600);
		}
		line.graphics.endStroke();
		stage.addChild(line);
		stage.update();

		// draw player
		player = new createjs.Shape();
		player.graphics.beginFill("black").drawCircle(10, 10, 10);
		stage.addChild(player);

		// sprites
		var spriteData = {
			images: ["resources/marioSprites2.png"],
			frames: [
	            // x, y, width, height, imageIndex, regX, regY
	            [0, 0,20,20,0],
	            [20,0,20,20,0]
	            [40,0,20,20,0],
	            [60,0,20,20,0]
        	],
			animations: {
			         spinAround: [1]
			     }
		};
 		var spriteSheet = new createjs.SpriteSheet(spriteData);
 		var sprite = new createjs.Sprite(spriteSheet, 0);
 		sprite.x = 20;
 		sprite.y = 20;
 		stage.addChild(sprite);

 		var sprite2 = new createjs.Sprite(spriteSheet, 1);
 		sprite2.x = 60;
 		sprite2.y = 20;
 		stage.addChild(sprite2);

		createjs.Ticker.addEventListener("tick", tick);
}


	function tick(event) {



		//call sub ticks
		stage.update(event);
	}

	function renderTile(x, y) {
		if (room[x][y] == '') {

		}
	}

	//allow for WASD and arrow control scheme
	function handleKeyDown(e) {
	//cross browser issues exist
	if(!e){ var e = window.event; }
		switch(e.keyCode) {
			case KEYCODE_LEFT:	{
				//Lobe.player.moveLeft();
				console.log('left');
				player.x -= 20;
				e.preventDefault();
				break;
			}
			case KEYCODE_RIGHT: {
				//Lobe.player.moveRight();
				player.x += 20;	
				e.preventDefault();
				break;
			}
			case KEYCODE_UP:	{
				//Lobe.player.moveUp();
				console.log('up');
				player.y -= 20;	
				e.preventDefault();
				break;
			}
			case KEYCODE_DOWN:  {
				//Lobe.player.moveDown();
				player.y += 20;	
				e.preventDefault();
				break;
			}
		}
	}