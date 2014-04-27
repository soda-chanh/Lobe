var Lobe;
(function (Lobe) {
    var player;
    var tileH = 20;
    var tileW = 20;
    var cols = 40;
    var rows = 30;
    var Point = (function () {
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        return Point;
    })();

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
                stage.addChildAt(this.stagedObject, idx);
            }
            this.resetPos();
        };
        StagedObject.prototype.addToStage = function (stage) {
            this.restage(stage);
        };
        StagedObject.prototype.resetPos = function () {
            this.stagedObject.x = this.stagePoint.x * tileW;
            this.stagedObject.y = this.stagePoint.y * tileH;
        };
        StagedObject.prototype.restage = function (stage) {
            var oldStage;
            if (stage != null) {
                oldStage = this.stagedObject.getStage();
                if (oldStage == null) {
                    oldStage.removechild(this.stagedObject);
                }
                stage.addChild(this.stagedObject);
            }
            this.resetPos();
        };
        return StagedObject;
    })();
    var Tile = (function () {
        function Tile(figure, x, y) {
            this.stagePoint = new Point(x, y);
            this.stagedObject = figure.create();
        }
        return Tile;
    })();
    function applyMixins(derivedCtor, baseCtors) {
        baseCtors.forEach(function (baseCtor) {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            });
        });
    }
    export function init() {
        applyMixins(Tile, [StagedObject]);
    }

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

    var Room = (function () {
        function Room(stage, defaultFigure) {
            this.stage = stage;
            this.tiles = [];
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < cols; j++) {
                    this.tiles[i][j] = new Tile(defaultFigure, j, i);
                }
            }
        }
        Room.prototype.tileAt = function (x, y) {
            return this.tiles[y][x];
        };
        Room.prototype.retileAll = function (figure) {
            this.visitTiles(function (tile) {
                tile.updateFigure(figure);
            });
        };
        Room.prototype.visitTiles = function (f) {
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < cols; j++) {
                    f(this.tiles[i][j]);
                }
            }
        };
        return Room;
    })();

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
    var figures;
})(Lobe || (Lobe = {}));
