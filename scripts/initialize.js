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
	var KEYCODE_S = 83;			//usefull keycode
	var KEYCODE_T = 84;			//usefull keycode
	var KEYCODE_U = 85;			//usefull keycode
	var KEYCODE_V = 86;			//usefull keycode
	var KEYCODE_W = 87;			//usefull keycode
	var KEYCODE_X = 88;			//usefull keycode
	var KEYCODE_Y = 89;			//usefull keycode
	var KEYCODE_Z = 90;			//usefull keycode
	var KEYCODE_F1 = 112;
	var KEYCODE_1 = 49;
	var KEYCODE_2 = 50;
	var KEYCODE_3 = 51;

	var room;
	var stage;
	var player;
	var textDisplay;

	document.onkeydown = handleKeyDown;

function init() {
	Lobe = window.Lobe;
	Lobe.init();
	initializeDarkFloor();
	Lobe.editor = new Lobe.Editor();
	Lobe.editor.replaceRoom = true;
	stage = new createjs.Stage("canvas");
	Lobe.editMode = false;
	window.lobe.flashingSquares = [];

	createTileFigures();
	window.lobe.SpriteManager.registerTiles();

	setupGame1();
	createjs.Ticker.addEventListener("tick", tick);
}

function initializeDarkFloor() {
	var floorFigure = {
		create: function() {
			var floorSprite = window.lobe.SpriteManager.getFloorSprite('darkFloor');
			return floorSprite;
		} 
	};
	Lobe.figures.put('darkFloor', floorFigure);
}

function drawLines() {
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
}

function createTileFigures() {
	var yellowFloor = {
		create: function() {
			return window.lobe.SpriteManager.getFloorSprite('yellowFloor');
		} 
	};
	var brightFloor = {
		create: function() {
			return window.lobe.SpriteManager.getFloorSprite('brightFloor');
		} 
	};
	var blackFigure = {
		create: function() {
			var blackSquare = new createjs.Shape();
 			blackSquare.graphics.beginFill("#000000").drawRect(0, 0, Lobe.tileW, Lobe.tileH);
 			return blackSquare;
		} 
	};
	var goalOutline = {
		create: function() {
			var outlined = new createjs.Shape();
 			outlined.graphics.beginFill("#ff0000").drawRect(0, 0, Lobe.tileW, Lobe.tileH);
 			outlined.graphics.beginFill("#000000").drawRect(5, 5, Lobe.tileW-10, Lobe.tileH-10);
 			return outlined;
		} 
	};

	Lobe.figures.put('yellowFloor', yellowFloor);
	Lobe.figures.put('brightFloor', brightFloor);
	Lobe.figures.put('blackFigure', blackFigure);
	Lobe.figures.put('goalOutline', goalOutline);
}


function toggleEditMode() {
	Lobe.toggleEditMode();
	var textArea = document.getElementById("textArea");
	if (Lobe.editMode) {
		displayText("Edit Mode!");	
		textArea.style.display='block';
	} else {
		displayText("Game Mode!");
		textArea.style.display='none';
	}
}
function addSquareFlash(t) {
	t.stagedObject.alpha = 0;
	window.lobe.flashingSquares.push(t);
}

function tick(event) {
	var removeMe = []
	for (var flash in window.lobe.flashingSquares){
		var square = window.lobe.flashingSquares[flash];
		square.stagedObject.alpha += 0.05;
		if (square.stagedObject.alpha >= 1)	{
			removeMe.push(flash);
		}
	}
	for (var r in removeMe) {
		window.lobe.flashingSquares.splice(r, 1);
	}
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
		case KEYCODE_1:  {
			setupGame1();
			break;
		}
		case KEYCODE_2:  {
			setupGame2();
			break;
		}

		case KEYCODE_3:  {
			setupGame3();
			break;
		}
		case KEYCODE_ENTER: {
			toggleEditMode();
			break;
		}
		default:
			if (Lobe.editMode) {
				editWithKeyCode(e.keyCode);
			}
	}
}

function editWithKeyCode(key) {
	switch(key) {
		case KEYCODE_A:	{
			Lobe.editor.placeTile('yellowFloor');
			break;
		}
		case KEYCODE_B: {
			Lobe.editor.placeTile('brightFloor');
			break;
		}
		case KEYCODE_C:	{
			Lobe.editor.placeTile('darkFloor');
			break;
		}
		case KEYCODE_M: {
			// Mask
			Lobe.editor.toggleMask();
			break;
		}
		case KEYCODE_S: {
			// Save
			var s = Lobe.editor.saveRoomToString();
			var textArea = document.getElementById("textArea");
			textArea.value = s;
			break;
		}
		case KEYCODE_L: {
			// Load
			var textArea = document.getElementById("textArea");
			console.log(typeof(textArea.value));
			Lobe.editor.loadRoom(textArea.value);
			break;
		}
		default: {
			var mm = key - KEYCODE_A;
			if (mm >= 0 && mm < Lobe.figures.values.length) {
				Lobe.editor.placeTile(Lobe.figures.key(mm));
			}
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
	textDisplay.x = 820;
	textDisplay.y = 100; 
	textDisplay.textBaseline = "alphabetic";
	stage.addChild(textDisplay);
}


function setupGame1() {

	var roomData = window.lobe.RoomManager.room1Data();
	room = new Lobe.Room(stage, roomData);
	room.retileAll(Lobe.figures.get('blackFigure'));
	room.finish = new Lobe.Point(Lobe.cols-1, Lobe.rows-1);

	var goalTile = room.tileAt(Lobe.cols-1, Lobe.rows-1);
	console.log(goalTile);
	goalTile.updateFigure(Lobe.figures.get('goalOutline'));

	drawLines();
	drawPlayer();

	var wallIdx = 0;
	var walls = [];
	room.onWallMove = function(p) {
		if (walls[wallIdx % 3]) {
			walls[wallIdx % 3].stagedObject.alpha = 1;
		}
		walls[wallIdx % 3] = room.tileAt(p.x, p.y);
		walls[wallIdx % 3].stagedObject.alpha = .7;
		wallIdx += 1;
	};

	room.onSuccessfulMove = function(p) {

		if (walls[wallIdx % 3]) {
			walls[wallIdx % 3].stagedObject.alpha = 1;
		}
		// on Win Game
		displayText('Level 1');
	};

	room.onOutOfBoundsMove = function(p) {
	};

	room.onEnterFinishMove = function(p) {
		displayText('Finished Level 1!');
		room.restage(null);
		setupGame2();
	};
}


function setupGame2() {

	var roomData = window.lobe.RoomManager.room2Data();

	console.log('room data = '+roomData);
	console.log('type = '+typeof(roomData));
	room = new Lobe.Room(stage, roomData);
	room.finish = new Lobe.Point(12,10);

	displayText('Level 2');	
	room.start = new Lobe.Point(Lobe.cols-1, Lobe.rows-1);

	drawLines();
	drawPlayer();

	console.log(Lobe.player);
	console.log(Lobe.player.stagedObject.getStage());

	var tilePath = [{x:12, y:5},
					{x:11, y:5},
					{x:10, y:5},
					{x:9, y:5},
					{x:8, y:5},
					{x:8, y:6},
					{x:8, y:7},
					{x:8, y:8},
					{x:8, y:9},
					{x:8, y:10},
					{x:9, y:10},
					{x:10, y:10},
					{x:11, y:10},
					{x:12, y:10}];

	var playerTiles = [];

	window.lobe.SoundManager.preloadAudioClips();
	room.onWallMove = function(p) {
	};
	room.onSuccessfulMove = function(p) {
		var point = Lobe.player.point;
		var tile = room.tileAt(point.x, point.y);

		var tileIndex = tilePath[playerTiles.length];
		if (tileIndex.x == point.x && tileIndex.y == point.y) {
			playerTiles.push(tile);
			tile.updateFigure(Lobe.figures.values[playerTiles.length+5]);
		} else {
			for (var t in playerTiles) {
				if (t != 0) {
					playerTiles[t].updateFigure(Lobe.figures.values[0]);
				} else {
					playerTiles[t].updateFigure(Lobe.figures.values[2]);
				}
				addSquareFlash(playerTiles[t]);	
			}
			playerTiles = [];
		}
	};
	room.onOutOfBoundsMove = function(p) {
	};
	room.onEnterFinishMove = function(p) {
		if (playerTiles.length == tilePath.length) {
			displayText('Finished Level 2!');
			// room.restage(null);
		}
	};
}


function setupGame3() {
	displayText('Level 3');
	room = new Lobe.Room(stage, Lobe.figures.get('greyTile'));
}


// game 1
function onFinishMove1() {
	room = new Lobe.Room(stage, Lobe.figures.get('redTile'));
	drawLines();
	drawPlayer();
}
