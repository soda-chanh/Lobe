interface Figure {
  create: () => any;
}
class StagedObject {
  stagedObject: any;
  stagePoint: Point;
  stageAt(x: number, y: number):void {
    this.stagePoint.x = x;
    this.stagePoint.y = y;
  }
  replaceObject(figure: Figure) {
    stage = this.stagedObject.getStage();
    this.stagedObject = figure.create();
    oldObject = this.stagedObject; 
    idx = stage.getChildIndex(oldObject);
    stage.removeChild(oldObject);
    stage.addChildAt(this.stagedObject, idx);
    restage();
  }
  restage() {
    this.figure.x = this.stagePoint.x * Tiles.width;
    this.figure.y = this.stagePoint.y * Tiles.height;
  }
}
class Tile implements StagedObject {
  tileId: number;
}
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}
interface StringDict {
  [index: string]: number;
}
class FigureDictionary<T> {
  dict: T[];
  keys: StringDict; 
  get(key: string): Figure {
    return dict[this.keys[key]];
  }
  put(key: string, value: Figure): void {
    if this.keys[contains]
    this.dict[key] = value;
  }
}

interface Mask {};
class Tile extends StageObject {
}
class Thing extends StagedObject {
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
class Point {
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  x: number;
  y: number;
}
module Tiles {
  var height: number = 20;
  var width: number = 20;
  var tileDict: TileDictionary;
  var tileIndex: string[];
  figureX(index: number):Figure {
    
  }
  figure(name: string): Figure {
  }
  tileX(index: number):Tile {
    tileDict.get(tileIndex[index]);
  }
  tile(name: string): 
}
module Things {
  var things()
}
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

class Player extends Thing {


}


