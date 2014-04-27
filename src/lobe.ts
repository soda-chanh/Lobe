module Lobe {
var tileH: number = 20;
var tileW: number = 20;
var cols: number = 40;
var rows: number = 30;
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
      stage.addChildAt(this.stagedObject, idx);
    }
    this.resetPos();
  }
  addToStage(stage: any) {
    this.restage(stage);
  }
  resetPos() {
    this.stagedObject.x = this.stagePoint.x * tileW;
    this.stagedObject.y = this.stagePoint.y * tileH;
  }
  restage(stage?: any):void {
    var oldStage:any;
    if (stage != null) {
      oldStage = this.stagedObject.getStage();
      if (oldStage != null) {
        oldStage.removeChild(this.stagedObject);
      }
      stage.addChild(this.stagedObject);
    }
    this.resetPos();
  }
}
export class Tile implements StagedObject {
  constructor(figure: Figure, x: number, y: number) {
    this.stagePoint = new Point(x, y);
    this.stagedObject = figure.create();
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

export class Room {
  stage: any;
  tiles: Tile[][];
  constructor(stage: any, defaultFigure: Figure) {
    this.stage = stage;
    this.tiles = [];
    for (var i:number=0; i < rows; i++) {
      this.tiles[i] = [];
      for (var j:number=0; j < cols; j++) {
        var tile: Tile = new Tile(defaultFigure, j, i);
        this.tiles[i][j] = tile;
        tile.addToStage(stage);
      }
    }
  }
  isMasked(x: number, y: number): boolean {
    return false;
  }
  tileAt(x: number, y: number): Tile {
    return this.tiles[y][x];
  }
  retileAll(figure: Figure) {
    this.visitTiles((tile: Tile) => {
        tile.updateFigure(figure);
      });
  }
  visitTiles(f: (tile: Tile) => any): void {
    for (var i:number=0; i < rows; i++) {
      for (var j:number=0; j < cols; j++) {
        f(this.tiles[i][j]);
      }
    }
  }
}

export class Player implements StagedObject {
  constructor() {
    this.stagePoint = new Point(0, 0);
    this.point = new Point(0, 0); 
  }
  room: Room;
  addToRoom(room: Room) {
    this.room = room;
  }
  point: Point;
  moveTo(x: number, y: number) {
    if (x >= 0 && x < cols || y >= 0 || y < rows) {
      if (!this.room.isMasked(x, y)) {
        new Point(x, y)
        this.onWallMove(new Point(x, y));
      } else {
        var p:Point = new Point(this.point.x, this.point.y);
        this.point.x = x;
        this.point.y = y;
        this.onSuccessfulMove(p);
        this.posAt(x, y);
      }
    } else {
      this.onOutOfBoundsMove(new Point(x, y));
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
  onSuccessfulMove: (oldPoint: Point) => void;
  onWallMove: (attemptedPoint: Point) => void;
  onOutOfBoundsMove: (attemptedPoint: Point) => void;
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

export var player = new Player();
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
