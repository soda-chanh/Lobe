export module Lobe {
var player: any;
var tileH: number = 20;
var tileW: number = 20;
var cols: number = 40;
var rows: number = 30;
class Point {
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  x: number;
  y: number;
}
interface Figure {
  create: () => any;
}
class StagedObject {
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
      if (oldStage == null) {
        oldStage.removechild(this.stagedObject);
      }
      stage.addChild(this.stagedObject);
    }
    this.resetPos();
  }
}
class Tile implements StagedObject {
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
function init() {
  applyMixins(Tile, [StagedObject]);
}
interface StringDict {
  [index: string]: number;
}
class Dictionary<T> {
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

class Room {
  stage: any;
  tiles: Tile[][];
  constructor(stage: any, defaultFigure: Figure) {
    this.stage = stage;
    this.tiles = [];
    for (var i:number=0; i < rows; i++) {
      for (var j:number=0; j < cols; j++) {
        this.tiles[i][j] = new Tile(defaultFigure, j, i);
      }
    }
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
var figures: Dictionary<Figure> = new Dictionary<Figure>();

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


lobe.init();
console.log(lobe);


