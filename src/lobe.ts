module Lobe {
export var tileH: number = 40;
export var tileW: number = 40;
export var cols: number = 20;
export var rows: number = 15;
export class Point {
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  x: number;
  y: number;
}
export interface Figure {
  create: () => any;
}
export class StagedObject {
  stagedObject: any;
  stagePoint: Point;
  posAt(x: number, y: number):void {
    this.stagePoint.x = x;
    this.stagePoint.y = y;
    this.resetPos();
  }
  updateFigure(figure: Figure) {
    this.replaceObject(figure.create());
  }
  replaceObject(object: any) {
    var stage:any, oldObject:any, idx:number;
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
  }
  addToStage(stage: any) {
    this.restage(stage);
  }
  resetPos() {
    if (this.stagedObject) {
      this.stagedObject.x = this.stagePoint.x * tileW;
      this.stagedObject.y = this.stagePoint.y * tileH;
    }
  }
  restage(stage?: any):void {
    var oldStage:any;
    oldStage = this.stagedObject.getStage();
    if (stage != null) {
      stage.addChild(this.stagedObject);
    }
    if (oldStage != null) {
      oldStage.removeChild(this.stagedObject);
    }
    this.resetPos();
  }
}
export class Tile implements StagedObject {
  constructor(figure: Figure, x: number, y: number) {
    this.stagePoint = new Point(x, y);
    if (figure != null) {
      this.stagedObject = figure.create();
    }
  }
  // StagedObject
  stagedObject: any; 
  stagePoint: Point;
  posAt: (x:number, y: number) => void;
  updateFigure: (figure: Figure) => void;
  replaceObject: (object: any) => void;
  addToStage: (stage: any) => void;
  resetPos: () => void;
  restage: (stage?: any) => void;

}
function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      derivedCtor.prototype[name] = baseCtor.prototype[name]; }) }); 
}
export function init() {
  applyMixins(Tile, [StagedObject]);
  applyMixins(Player, [StagedObject]);
  player = new Player();
}
export interface StringDict {
  [index: string]: number;
}
export class Dictionary<T> {
  index: StringDict; 
  values: T[];
  keys: string[];
  constructor() {
    this.index = {};
    this.keys = [];
    this.values = [];
  }
  contains(key:string): boolean {
    return key in this.index;
  }
  indexOf(key: string): number {
    return this.index[key];
  }
  key(i: number): string {
    return this.keys[i];
  }
  get(key: string): T {
    return this.values[this.index[key]];
  }
  put(key: string, value: T): number {
    var idx:number = -1;
    if (!(key in this.index)) {
      idx = this.keys.length;
      this.index[key] = this.keys.length;
      this.keys.push(key);
      this.values.push(value);
    }
    return idx;
  }
}
export interface RoomFileInterface {
  tiles: number[][];
  mask: number[][];
  start: Point;
  finish: Point;
}

export class RoomFile {
  tileLayer: number[][];
  maskLayer: number[][]; 
  start: Point;
  finish: Point;
  constructor(data?: any) {
    this.tileLayer = [];
    this.maskLayer = [];
    for (var i:number=0; i < rows; i++) {
      this.tileLayer[i] = [];
      this.maskLayer[i] = [];
      this.start = new Point(0, 0);
      this.finish = new Point(0, 0);
      for (var j: number=0; j < cols; j++) {
        this.tileLayer[i][j] = 0;
        this.maskLayer[i][j] = 0;
      }
    }
    this.start = new Point(0,0);
    this.finish = new Point(0,0);
    if (data) {
      if (typeof(data) == 'string') {
        this.parseFromString(data);
      } else {
        this.parse(data);
      }
    }
  }
  parse(data: RoomFileInterface) {
    for (var i: number=0; i < rows; i++) {
      var tileRow:number[] = data.tiles[i] || [];
      var maskRow:number[] = data.mask[i] || [];
      for (var j: number=0; j < cols; j++) {
        this.tileLayer[i][j] = tileRow[j] || 0;
        this.maskLayer[i][j] = maskRow[j] || 0;
      }
    }
    this.start.x = data.start.x || 0;
    this.start.y = data.start.y || 0;
    this.finish.x = data.finish.x || 0;
    this.finish.y = data.finish.y || 0;
  }
  parseFromString(data: string) {
    this.parse(JSON.parse(data));
  }
  serialize(): any {
    var data:any = {};
    data.tiles = [];
    data.mask = [];
    for (var i: number=0; i < rows; i++) {
      data.tiles[i] = [];
      data.mask[i] = [];
      for (var j: number=0; j < cols; j++) {
        data.tiles[i][j] = this.tileLayer[i][j];
        data.mask[i][j] = this.maskLayer[i][j];
      }
    }
    data.start = { x: this.start.x, y: this.start.y };
    data.finish = { x: this.finish.x, y: this.finish.y};
    return data;
  }
  serializeToString(): string {
    return JSON.stringify(this.serialize(), null, 0);
  }
}

export class Room {
  stage: any;
  name: string;
  tiles: Tile[][];
  start: Point;
  finish: Point;
  mask: number[][];
  roomFile: RoomFile;
  constructor(stage: any, roomFile?: any) {
    this.stage = stage;
    this.roomFile = new RoomFile(roomFile);
    this.tiles = [];
    this.mask = [];
    this.start = new Point(this.roomFile.start.x, this.roomFile.start.y);
    this.finish = new Point(this.roomFile.finish.x, this.roomFile.finish.y);
    for (var i:number=0; i < rows; i++) {
      this.tiles[i] = [];
      this.mask[i] = [];
      for (var j:number=0; j < cols; j++) {
        var figureId = this.roomFile.tileLayer[i][j];
        this.tiles[i][j] = new Tile(figures.values[figureId], j, i);
        this.tiles[i][j].restage(stage);
        this.mask[i][j] = this.roomFile.maskLayer[i][j];
      }
    }
  }
  isMasked(x: number, y: number): boolean {
    return this.mask[y][x] != 0;
  }
  onSuccessfulMove: (oldPoint: Point) => void;
  onWallMove: (attemptedPoint: Point) => void;
  onOutOfBoundsMove: (attemptedPoint: Point) => void;
  onEnterFinishMove: (oldPoint: Point) => void;
  tileAt(x: number, y: number): Tile {
    return this.tiles[y][x];
  }
  retileAll(figure: Figure) {
    this.visitTiles((tile: Tile) => {
        tile.updateFigure(figure);
      });
  }
  visitTilesXY(f: (tile: Tile, x: number, y: number) => any): void {
    for (var i:number=0; i < rows; i++) {
      for (var j:number=0; j < cols; j++) {
        f(this.tiles[i][j], j, i);
      }
    }
  }
  visitTiles(f: (tile: Tile) => any): void {
    for (var i:number=0; i < rows; i++) {
      for (var j:number=0; j < cols; j++) {
        f(this.tiles[i][j]);
      }
    }
  }
}
export var editor: Editor;
export function toggleEditMode() {
  if (editMode) {
    editor.leaveEditMode();
  } else {
    editor.enterEditMode();
  }
}

export var editMode: boolean = false;

export class Editor {
  constructor() {
    editMode = false;
    this.maskTiles = [];
    this.savedFigures = [];
    for (var i: number = 0; i < cols; i++) {
      this.savedFigures[i] = [];
      this.maskTiles[i] = [];
      for (var j: number = 0; j < cols; j++) {
        this.maskTiles[i][j] = new Tile(figures.get("darkFloor"), j, i);
      }
    }
    this.maskAlpha = .5;
    this.replaceRoom = true;
    this.useMaskLayer = false;
  }
  replaceRoom: boolean;
  useMaskLayer:boolean;
  maskAlpha: number;
  maskTiles: Tile[][];
  savedFigures: any[][];
  enterEditMode() {
    editMode = true;
    if (!this.replaceRoom) {
      player.room.visitTilesXY((tile: Tile, x: number, y: number) => {
          this.savedFigures[y][x] = tile.stagedObject;
        });
    }
    this.refreshRoom();
  }
  unstageTiles() {
    for (var i: number; i < rows; i++) {
      for (var j: number; j < rows; j++) {
        this.maskTiles[i][j].restage(null);
      }
    }
  }
  leaveEditMode() {
    this.unstageTiles();
    if (this.replaceRoom) {
      player.room.start.x = player.room.roomFile.start.x;
      player.room.start.y = player.room.roomFile.start.y;
      player.room.finish.x = player.room.roomFile.finish.x;
      player.room.finish.y = player.room.roomFile.finish.y;
    }
    player.room.visitTilesXY((tile: Tile, x: number, y: number) => {
        if (this.replaceRoom) {
          player.room.mask[y][x] = player.room.roomFile.maskLayer[y][x];
          tile.stagedObject.alpha = 1;
        } else {
          tile.replaceObject(this.savedFigures[y][x]);
        }
      });
    player.forcedMoveTo(player.room.start.x, player.room.start.y);
    editMode = false;
  }
  placeTileAt(figureName: string, x: number, y: number) {
    var tile:Tile = player.room.tileAt(x, y);
    var oldAlpha: number = tile.stagedObject.alpha;
    tile.updateFigure(figures.get(figureName));
    tile.stagedObject.alpha = oldAlpha;
    player.room.roomFile.tileLayer[y][x] = figures.indexOf(figureName);
  }
  placeTile(figureName: string) {
    this.placeTileAt(figureName, player.point.x, player.point.y);
  }
  toggleMask() {
    var roomFile: RoomFile = player.room.roomFile;
    var x: number = player.point.x;
    var y: number = player.point.y;
    var tile: Tile = player.room.tileAt(x,y);
    var maskTile: Tile = this.maskTiles[y][x];
    if (roomFile.maskLayer[y][x] == 0) {
      roomFile.maskLayer[y][x] = 1;
      if (this.useMaskLayer) {
        maskTile.stagedObject.alpha = this.maskAlpha;
      } else {
        tile.stagedObject.alpha = 1 - this.maskAlpha;
      }
    } else {
      roomFile.maskLayer[y][x] = 0;
      if (this.useMaskLayer) {
        maskTile.stagedObject.alpha = 0;
      } else {
        tile.stagedObject.alpha = 1;
      }
      maskTile.stagedObject.alpha = 0;
    }
  }
  refreshRoom() {
    player.room.visitTilesXY((tile: Tile, x: number, y: number) => {
        tile.updateFigure(figures.values[player.room.roomFile.tileLayer[y][x]]);
        if (!this.useMaskLayer) {
          if (player.room.roomFile.maskLayer[y][x] == 0) {
            tile.stagedObject.alpha = 1;
          } else {
            tile.stagedObject.alpha = 1 - this.maskAlpha;
          }
        }
      });
    if (this.useMaskLayer) {
      for (var i: number=0; i < rows; i++) {
        for (var j: number=0; j < cols; j++) {
          if (player.room.roomFile.maskLayer[i][j] == 0) {
            this.maskTiles[i][j].stagedObject.alpha = 0;
          } else {
            this.maskTiles[i][j].stagedObject.alpha = this.maskAlpha;
          }
          this.maskTiles[i][j].restage(player.room.stage);
        }
      }
    }
  }
  placeStart() {
    player.room.roomFile.start.x = player.point.x;
    player.room.roomFile.start.y = player.point.y;
  }
  placeFinish() {
    player.room.roomFile.finish.x = player.point.x;
    player.room.roomFile.finish.y = player.point.y;
  }
  saveRoomToJson():any {
    return player.room.roomFile.serialize();
  }
  saveRoomToString(): string {
    return player.room.roomFile.serializeToString();
  }
  loadRoom(data: any) {
    if (editMode) {
      if (typeof(data) == 'string') {
        player.room.roomFile.parseFromString(data);
      } else {
        player.room.roomFile.parse(data);
      }
      this.refreshRoom();
    }
  }
}

export class Player implements StagedObject {
  constructor() {
    this.stagePoint = new Point(0, 0);
    this.point = new Point(0, 0); 
  }
  room: Room;
  moveToRoom(room: Room) {
    this.room = room;
    this.point.x = room.start.x;  
    this.point.y = room.start.y;
    this.posAt(room.start.x, room.start.y);
    this.addToStage(this.room.stage);
  }
  point: Point;
  forcedMoveTo(x: number, y: number) {
    this.point.x = x;
    this.point.y = y;
    this.posAt(x, y);
  }
  moveTo(x: number, y: number) {
    if (x >= 0 && x < cols && y >= 0 && y < rows) {
      if (!editMode && this.room.isMasked(x, y)) {
        if (!editMode) {
          this.room.onWallMove(new Point(x, y));
        }
      } else {
        var p:Point = new Point(this.point.x, this.point.y);
        this.point.x = x;
        this.point.y = y;
        if (!editMode) {
          this.room.onSuccessfulMove(p);
        }
        this.posAt(x, y);
        if (!editMode && x == this.room.finish.x && y == this.room.finish.y) {
          this.room.onEnterFinishMove(p);
        }
      }
    } else {
      if (!editMode) {
        this.room.onOutOfBoundsMove(new Point(x, y));
      }
    }
  }
  moveLeft() {
    this.moveTo(this.point.x - 1, this.point.y);
  }
  moveRight() {
    this.moveTo(this.point.x + 1, this.point.y);
  }
  moveUp() {
    this.moveTo(this.point.x, this.point.y - 1);
  }
  moveDown() {
    this.moveTo(this.point.x, this.point.y + 1);
  }
  // StagedObject
  stagedObject: any; 
  stagePoint: Point;
  posAt: (x:number, y: number) => void;
  updateFigure: (figure: Figure) => void;
  replaceObject: (object: any) => void;
  addToStage: (stage: any) => void;
  resetPos: () => void;
  restage: (stage?: any) => void;
}
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
export var figures: Dictionary<Figure> = new Dictionary<Figure>();

export var player;
/*
class Room {
  backgroundLayer:Tile[][];
  maskLayer:Mask[][];
  thingLayer:Thing[][];
  startPoint:Point;
  endPoint:Point;
  constructor() {};
  objectAt(x:number, y:number): Thing {
    return this.thingLayer[x][y];
  }
}
*/

};
