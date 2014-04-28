/// <reference path="lobe.ts" />


	var KEYCODE_ENTER = 13;		//usefull keycode
	var KEYCODE_SPACE = 32;		//usefull keycode
	var KEYCODE_UP = 38;		//usefull keycode
	var KEYCODE_LEFT = 37;		//usefull keycode
	var KEYCODE_RIGHT = 39;		//usefull keycode
	var KEYCODE_DOWN = 40;		//usefull keycode
	var KEYCODE_A = 65;			//usefull keycode
	var KEYCODE_B = 66;			//usefull keycode
	var KEYCODE_C = 67;			//usefull keycode
	var KEYCODE_D = 68;			//usefull keycode
	var KEYCODE_E = 69;			//usefull keycode
	var KEYCODE_F = 70;			//usefull keycode
	var KEYCODE_G = 71;			//usefull keycode
	var KEYCODE_H = 72;			//usefull keycode
	var KEYCODE_I = 73;			//usefull keycode
	var KEYCODE_J = 74;			//usefull keycode
	var KEYCODE_K = 75;			//usefull keycode
	var KEYCODE_L = 76;			//usefull keycode
	var KEYCODE_M = 77;			//usefull keycode
	var KEYCODE_N = 78;			//usefull keycode
	var KEYCODE_O = 79;			//usefull keycode
	var KEYCODE_P = 80;			//usefull keycode
	var KEYCODE_Q = 81;			//usefull keycode
	var KEYCODE_F1 = 112;

	var room;
	var stage;
	var player;
	var inEditMode;
	var textDisplay;

	document.onkeydown = handleKeyDown;

function init() {
	Lobe = window.Lobe;
	Lobe.init();
	stage = new createjs.Stage("canvas");
	inEditMode = false;

	drawRoom();
	drawPlayer();

	createjs.Ticker.addEventListener("tick", tick);
}

function drawRoom() {
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
}


function drawPlayer() {

	var playerSprite = window.lobe.SpriteManager.getPlayerSprite('stand');
	Lobe.player.replaceObject(playerSprite);
	Lobe.player.moveToRoom(room);

		var backwards = false;
	// set up callbacks for player movement
	room.onWallMove = function(p) {
		Lobe.player.replaceObject(sprite3);
	};
	room.onSuccessfulMove = function(p) { 
		if (backwards) {

			backwards = false;
			var playerSprite = window.lobe.SpriteManager.getPlayerSprite('stand');
			Lobe.player.replaceObject(playerSprite);
		} else {
			backwards = true;
			var playerSprite = window.lobe.SpriteManager.getPlayerSprite('stand');
			Lobe.player.replaceObject(playerSprite);
		}

	};
	room.onOutOfBoundsMove = function(p) {
		Lobe.player.replaceObject(sprite3);
	};
}


function toggleEditMode() {
	inEditMode = !inEditMode;
	// Lobe.toggleEditMode();
	// player.saveRoom inEditMode
	// player.loadRoom inEditMode
	if (inEditMode) {
		displayText("Edit Mode!");	
	} else {
		displayText("Game Mode!");
	}
	stage.removeChild(Lobe.player.stageObject);
}

function tick(event) {
	stage.update(event);
}


function handleKeyDown(e) {
//cross browser issues exist
if(!e){ var e = window.event; }
	switch(e.keyCode) {
		case KEYCODE_LEFT:	{
			Lobe.player.moveLeft();
			e.preventDefault();
			break;
		}
		case KEYCODE_RIGHT: {
			Lobe.player.moveRight();
			e.preventDefault();
			break;
		}
		case KEYCODE_UP:	{
			Lobe.player.moveUp();
			e.preventDefault();
			break;
		}
		case KEYCODE_DOWN:  {
			Lobe.player.moveDown();
			e.preventDefault();
			break;
		}
		case KEYCODE_ENTER: {
			toggleEditMode();
			break;
		}
		default:
			if (inEditMode) {
				editWithKeyCode(e.keyCode);
			}
	}
}

function editWithKeyCode(key) {
	console.log('edit key ' +key);
	switch(key) {
		case KEYCODE_A:	{
			var tile = room.tileAt(Lobe.player.point.x, Lobe.player.point.y);
			var floorSprite = window.lobe.SpriteManager.getFloorSprite('darkFloor');
			tile.replaceObject(floorSprite);
			break;
		}
		case KEYCODE_B: {
			var tile = room.tileAt(Lobe.player.point.x, Lobe.player.point.y);
			var floorSprite = window.lobe.SpriteManager.getFloorSprite('yellowFloor');
			tile.replaceObject(floorSprite);
			break;
		}
		case KEYCODE_C:	{
			var tile = room.tileAt(Lobe.player.point.x, Lobe.player.point.y);
			var floorSprite = window.lobe.SpriteManager.getFloorSprite('brightFloor');
			tile.replaceObject(floorSprite);
			break;
		}
		case KEYCODE_D:  {
			break;
		}
		case KEYCODE_E: {
			break;
		}
	}
	// Lobe.Player.room.placeTile();
}

function displayText(string) {
	if (textDisplay) {
		stage.removeChild(textDisplay);
	}
	textDisplay = new createjs.Text(string, "20px Arial", "#000000"); 
	textDisplay.x = 50;
	textDisplay.y = 650; 
	textDisplay.textBaseline = "alphabetic";
	stage.addChild(textDisplay);
}