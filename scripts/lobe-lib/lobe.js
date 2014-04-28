var Lobe;
(function (Lobe) {
    Lobe.tileH = 40;
    Lobe.tileW = 40;
    Lobe.cols = 20;
    Lobe.rows = 15;
    var Point = (function () {
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        return Point;
    })();
    Lobe.Point = Point;

    var StagedObject = (function () {
        function StagedObject() {
        }
        StagedObject.prototype.posAt = function (x, y) {
            this.stagePoint.x = x;
            this.stagePoint.y = y;
            this.resetPos();
        };
        StagedObject.prototype.updateFigure = function (figure) {
            this.replaceObject(figure.create());
        };
        StagedObject.prototype.replaceObject = function (object) {
            var stage, oldObject, idx;
            if (this.stagedObject != null) {
                stage = this.stagedObject.getStage();
                oldObject = this.stagedObject;
            }
            this.stagedObject = object;
            if (stage != null) {
                idx = stage.getChildIndex(oldObject);
                stage.removeChild(oldObject);
                if (object) {
                    stage.addChildAt(this.stagedObject, idx);
                }
            }
            this.resetPos();
        };
        StagedObject.prototype.addToStage = function (stage) {
            this.restage(stage);
        };
        StagedObject.prototype.resetPos = function () {
            if (this.stagedObject) {
                this.stagedObject.x = this.stagePoint.x * Lobe.tileW;
                this.stagedObject.y = this.stagePoint.y * Lobe.tileH;
            }
        };
        StagedObject.prototype.restage = function (stage) {
            var oldStage;
            oldStage = this.stagedObject.getStage();
            if (stage != null) {
                stage.addChild(this.stagedObject);
            }
            if (oldStage != null) {
                oldStage.removeChild(this.stagedObject);
            }
            this.resetPos();
        };
        return StagedObject;
    })();
    Lobe.StagedObject = StagedObject;
    var Tile = (function () {
        function Tile(figure, x, y) {
            this.stagePoint = new Point(x, y);
            if (figure != null) {
                this.stagedObject = figure.create();
            }
        }
        return Tile;
    })();
    Lobe.Tile = Tile;
    function applyMixins(derivedCtor, baseCtors) {
        baseCtors.forEach(function (baseCtor) {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            });
        });
    }
    function init() {
        applyMixins(Tile, [StagedObject]);
        applyMixins(Player, [StagedObject]);
        Lobe.player = new Player();
    }
    Lobe.init = init;

    var Dictionary = (function () {
        function Dictionary() {
            this.index = {};
            this.keys = [];
            this.values = [];
        }
        Dictionary.prototype.contains = function (key) {
            return key in this.index;
        };
        Dictionary.prototype.indexOf = function (key) {
            return this.index[key];
        };
        Dictionary.prototype.key = function (i) {
            return this.keys[i];
        };
        Dictionary.prototype.get = function (key) {
            return this.values[this.index[key]];
        };
        Dictionary.prototype.put = function (key, value) {
            var idx = -1;
            if (!(key in this.index)) {
                idx = this.keys.length;
                this.index[key] = this.keys.length;
                this.keys.push(key);
                this.values.push(value);
            }
            return idx;
        };
        return Dictionary;
    })();
    Lobe.Dictionary = Dictionary;

    var RoomFile = (function () {
        function RoomFile(data) {
            this.tileLayer = [];
            this.maskLayer = [];
            for (var i = 0; i < Lobe.rows; i++) {
                this.tileLayer[i] = [];
                this.maskLayer[i] = [];
                this.start = new Point(0, 0);
                this.finish = new Point(0, 0);
                for (var j = 0; j < Lobe.cols; j++) {
                    this.tileLayer[i][j] = 0;
                    this.maskLayer[i][j] = 0;
                }
            }
            this.start = new Point(0, 0);
            this.finish = new Point(0, 0);
            if (data) {
                if (data instanceof String) {
                    this.parseFromString(data);
                } else {
                    this.parse(data);
                }
            }
        }
        RoomFile.prototype.parse = function (data) {
            for (var i = 0; i < Lobe.rows; i++) {
                var tileRow = data.tiles[i] || [];
                var maskRow = data.mask[i] || [];
                for (var j = 0; j < Lobe.cols; j++) {
                    this.tileLayer[i][j] = tileRow[j] || 0;
                    this.maskLayer[i][j] = maskRow[j] || 0;
                }
            }
            this.start.x = data.start.x || 0;
            this.start.y = data.start.y || 0;
            this.finish.x = data.finish.x || 0;
            this.finish.y = data.finish.y || 0;
        };
        RoomFile.prototype.parseFromString = function (data) {
            this.parse(JSON.parse(data));
        };
        RoomFile.prototype.serialize = function () {
            var data = {};
            data.tiles = [];
            data.mask = [];
            for (var i = 0; i < Lobe.rows; i++) {
                data.tiles[i] = [];
                data.mask[i] = [];
                for (var j = 0; j < Lobe.cols; j++) {
                    data.tiles[i][j] = this.tileLayer[i][j];
                    data.mask[i][j] = this.maskLayer[i][j];
                }
            }
            data.start = { x: this.start.x, y: this.start.y };
            data.finish = { x: this.finish.x, y: this.finish.y };
            return data;
        };
        RoomFile.prototype.serializeToString = function () {
            return JSON.stringify(this.serialize(), null, 1);
        };
        return RoomFile;
    })();
    Lobe.RoomFile = RoomFile;

    var Room = (function () {
        function Room(stage, roomFile) {
            this.stage = stage;
            this.roomFile = new RoomFile(roomFile);
            this.tiles = [];
            this.mask = [];
            this.start = new Point(this.roomFile.start.x, this.roomFile.start.y);
            this.finish = new Point(this.roomFile.finish.x, this.roomFile.finish.y);
            for (var i = 0; i < Lobe.rows; i++) {
                this.tiles[i] = [];
                this.mask[i] = [];
                for (var j = 0; j < Lobe.cols; j++) {
                    var figureId = this.roomFile.tileLayer[i][j];
                    this.tiles[i][j] = new Tile(Lobe.figures.values[figureId], j, i);
                    this.tiles[i][j].restage(stage);
                    this.mask[i][j] = this.roomFile.maskLayer[i][j];
                }
            }
        }
        Room.prototype.isMasked = function (x, y) {
            return this.mask[y][x] != 0;
        };

        Room.prototype.tileAt = function (x, y) {
            return this.tiles[y][x];
        };
        Room.prototype.retileAll = function (figure) {
            this.visitTiles(function (tile) {
                tile.updateFigure(figure);
            });
        };
        Room.prototype.visitTilesXY = function (f) {
            for (var i = 0; i < Lobe.rows; i++) {
                for (var j = 0; j < Lobe.cols; j++) {
                    f(this.tiles[i][j], j, i);
                }
            }
        };
        Room.prototype.visitTiles = function (f) {
            for (var i = 0; i < Lobe.rows; i++) {
                for (var j = 0; j < Lobe.cols; j++) {
                    f(this.tiles[i][j]);
                }
            }
        };
        return Room;
    })();
    Lobe.Room = Room;
    Lobe.editor;
    function toggleEditMode() {
        if (Lobe.editMode) {
            Lobe.editor.leaveEditMode();
        } else {
            Lobe.editor.enterEditMode();
        }
    }
    Lobe.toggleEditMode = toggleEditMode;

    Lobe.editMode;

    var Editor = (function () {
        function Editor() {
            Lobe.editMode = false;
            this.maskTiles = [];
            this.savedFigures = [];
            for (var i = 0; i < Lobe.cols; i++) {
                this.savedFigures[i] = [];
                this.maskTiles[i] = [];
                for (var j = 0; j < Lobe.cols; j++) {
                    this.maskTiles[i][j] = new Tile(Lobe.figures.get("darkFloor"), j, i);
                }
            }
            this.maskAlpha = .5;
            this.replaceRoom = true;
        }
        Editor.prototype.enterEditMode = function () {
            var _this = this;
            Lobe.editMode = true;
            if (!this.replaceRoom) {
                Lobe.player.room.visitTilesXY(function (tile, x, y) {
                    _this.savedFigures[y][x] = tile.stagedObject;
                });
            }
            this.refreshRoom();
        };
        Editor.prototype.unstageTiles = function () {
            for (var i; i < Lobe.rows; i++) {
                for (var j; j < Lobe.rows; j++) {
                    this.maskTiles[i][j].restage(null);
                }
            }
        };
        Editor.prototype.leaveEditMode = function () {
            var _this = this;
            this.unstageTiles();
            Lobe.player.room.visitTilesXY(function (tile, x, y) {
                if (_this.replaceRoom) {
                    Lobe.player.room.mask[y][x] = Lobe.player.room.roomFile.maskLayer[y][x];
                } else {
                    tile.replaceObject(_this.savedFigures[y][x]);
                }
            });
            Lobe.editMode = false;
        };
        Editor.prototype.placeTileAt = function (figureName, x, y) {
            var tile = Lobe.player.room.tileAt(x, y);
            tile.updateFigure(Lobe.figures.get(figureName));
            Lobe.player.room.roomFile.tileLayer[y][x] = Lobe.figures.indexOf(figureName);
        };
        Editor.prototype.placeTile = function (figureName) {
            this.placeTileAt(figureName, Lobe.player.point.x, Lobe.player.point.y);
        };
        Editor.prototype.toggleMask = function () {
            var roomFile = Lobe.player.room.roomFile;
            var x = Lobe.player.point.x;
            var y = Lobe.player.point.y;
            var maskTile = this.maskTiles[y][x];
            if (roomFile.maskLayer[y][x] == 0) {
                var tile = Lobe.player.room.tileAt(x, y);
                roomFile.maskLayer[y][x] = 1;
                maskTile.stagedObject.alpha = this.maskAlpha;
            } else {
                roomFile.maskLayer[y][x] = 0;
                maskTile.stagedObject.alpha = 0;
            }
        };
        Editor.prototype.refreshRoom = function () {
            Lobe.player.room.visitTilesXY(function (tile, x, y) {
                tile.updateFigure(Lobe.figures.values[Lobe.player.room.roomFile.tileLayer[y][x]]);
            });
            for (var i; i < Lobe.rows; i++) {
                for (var j; j < Lobe.rows; j++) {
                    if (Lobe.player.room.roomFile.maskLayer[i][j] == 0) {
                        this.maskTiles[i][j].stagedObject.alpha = 0;
                    } else {
                        this.maskTiles[i][j].stagedObject.alpha = .5;
                    }
                    this.maskTiles[i][j].restage(Lobe.player.room.stage);
                }
            }
        };
        Editor.prototype.placeStart = function () {
            Lobe.player.room.roomFile.start.x = Lobe.player.point.x;
            Lobe.player.room.roomFile.start.y = Lobe.player.point.y;
        };
        Editor.prototype.placeFinish = function () {
            Lobe.player.room.roomFile.finish.x = Lobe.player.point.x;
            Lobe.player.room.roomFile.finish.y = Lobe.player.point.y;
        };
        Editor.prototype.saveRoomToJson = function () {
            return Lobe.player.room.roomFile.serialize();
        };
        Editor.prototype.saveRoomToString = function () {
            return Lobe.player.room.roomFile.serializeToString();
        };
        Editor.prototype.loadRoom = function (data) {
            if (Lobe.editMode) {
                Lobe.player.room.roomFile.parseFrom(data);
                this.refreshRoom();
            }
        };
        return Editor;
    })();
    Lobe.Editor = Editor;

    var Player = (function () {
        function Player() {
            this.stagePoint = new Point(0, 0);
            this.point = new Point(0, 0);
        }
        Player.prototype.moveToRoom = function (room) {
            this.room = room;
            this.point.x = room.start.x;
            this.point.y = room.start.y;
            this.posAt(room.start.x, room.start.y);
            this.addToStage(this.room.stage);
        };

        Player.prototype.moveTo = function (x, y) {
            if (x >= 0 && x < Lobe.cols && y >= 0 && y < Lobe.rows) {
                if (!Lobe.editMode && this.room.isMasked(x, y)) {
                    if (!Lobe.editMode) {
                        this.room.onWallMove(new Point(x, y));
                    }
                } else {
                    var p = new Point(this.point.x, this.point.y);
                    this.point.x = x;
                    this.point.y = y;
                    if (!Lobe.editMode) {
                        this.room.onSuccessfulMove(p);
                    }
                    this.posAt(x, y);
                    if (x == this.room.finish.x && y == this.room.finish.y) {
                        this.room.onEnterFinishMove(p);
                    }
                }
            } else {
                if (!Lobe.editMode) {
                    this.room.onOutOfBoundsMove(new Point(x, y));
                }
            }
        };
        Player.prototype.moveLeft = function () {
            this.moveTo(this.point.x - 1, this.point.y);
        };
        Player.prototype.moveRight = function () {
            this.moveTo(this.point.x + 1, this.point.y);
        };
        Player.prototype.moveUp = function () {
            this.moveTo(this.point.x, this.point.y - 1);
        };
        Player.prototype.moveDown = function () {
            this.moveTo(this.point.x, this.point.y + 1);
        };
        return Player;
    })();
    Lobe.Player = Player;

    /*
    class Thing implements StagedObject {
    point: Point;
    room: Room;
    moveTo(x: number, y: number): void {
    this.point.x = x;
    this.point.y = y;
    }
    moveToPoint(p: Point) {
    this.point.x = p.x;
    this.point.y = p.y;
    }
    }
    */
    Lobe.figures = new Dictionary();

    Lobe.player;
})(Lobe || (Lobe = {}));
;
