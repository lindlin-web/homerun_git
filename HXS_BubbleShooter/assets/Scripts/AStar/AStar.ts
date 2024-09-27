import { Vec2 } from "cc";
import { SEARCHDIRECTION } from "../data/GroupMgr";
import { Util } from "../util/Util";
import { Grid } from "./Grid";
import { MyNode } from "./MyNode";

export class AStar {
    private _open:MyNode[];
    private _closed:MyNode[];
    private _grid:Grid;
    private _endNode:MyNode;
    private _startNode:MyNode;
    private _path:MyNode[];
    private _heuristic:Function = this.diagonal;
    private _straightCost:number = 1.0;
    private _diagCost:number = Math.SQRT2;

    public constructor() {

    }

    public findPath(grid:Grid):boolean {
        this._grid = grid;
        this._open = [];
        this._closed = [];

        this._startNode = this._grid.getStartNode();
        this._endNode = this._grid.getEndNode();


        this._startNode.g = 0;
        this._startNode.h = this._heuristic(this._startNode);
        this._startNode.f = this._startNode.g + this._startNode.h;
        return this.search();
    }

    public search():boolean {
        var node:MyNode = this._startNode;
        while(node != this._endNode) {
            // 判断是否是单行的，还是双行的. 单双行的判断是不一样的。
            var startX:number = Math.max(0, node.x - 1);
            var endX:number = Math.min(this._grid.getNumCols() - 1, node.x + 1);
            var startY:number = Math.max(0, node.y - 1);
            var endY:number = Math.min(this._grid.getNumRows() - 1, node.y + 1);


            for(let i = 0; i <= SEARCHDIRECTION.RIGHT; i++) {
                let vec:Vec2 = Util.getColumnAndRowByDirection(node.x, node.y,i);
                var test:MyNode = this._grid.getNode(vec.x, vec.y);
                if(!test || test == node || !test.walkable) continue;
                var cost:number = this._straightCost;
                if(!((node.x == test.x) || (node.y == test.y))) {
                    cost = this._diagCost;
                }
                var g:number = node.g + cost;
                var h:number = this._heuristic(test);
                var f:number = g + h;
                if(this.isOpen(test) || this.isClosed(test)) {
                    if(test.f > f) {
                        test.f = f;
                        test.g = g;
                        test.h = h;
                        test.parent = node;
                    }
                }
                else {
                    test.f = f;
                    test.g = g;
                    test.h = h;
                    test.parent = node;
                    this._open.push(test);
                }
            }


            // for(let i:number = startX; i <= endX; i++) {
            //     for(let j:number = startY; j <= endY; j++) {
            //         var test:MyNode = this._grid.getNode(i, j);
            //         if(test == node || !test.walkable) continue;

            //         var cost:number = this._straightCost;
            //         if(!((node.x == test.x) || (node.y == test.y))) {
            //             cost = this._diagCost;
            //         }
            //         var g:number = node.g + cost;
            //         var h:number = this._heuristic(test);
            //         var f:number = g + h;
            //         if(this.isOpen(test) || this.isClosed(test)) {
            //             if(test.f > f) {
            //                 test.f = f;
            //                 test.g = g;
            //                 test.h = h;
            //                 test.parent = node;
            //             }
            //         }
            //         else {
            //             test.f = f;
            //             test.g = g;
            //             test.h = h;
            //             test.parent = node;
            //             this._open.push(test);
            //         }
            //     }
            // }

            
            this._closed.push(node);
            if(this._open.length == 0) {
                console.log("==========no path found=============");
                return false;
            }
            this._open.sort((a, b)=>a.f -b.f);
            node = this._open.shift() as MyNode;
        }
        this.buildPath();
        return true;
    }

    private buildPath():void {
        this._path = [];
        var node:MyNode = this._endNode;
        this._path.push(node);
        while(node != this._startNode) {
            node = node.parent;
            this._path.unshift(node);
        }
    }

    public getPath():MyNode[] {
        return this._path;
    }

    private isOpen(node:MyNode):boolean {
        for(let i:number = 0; i < this._open.length; i++) {
            if(this._open[i] == node) {
                return true;
            }
        }
        return false;
    }

    private isClosed(node:MyNode):boolean {
        for(let i:number = 0; i < this._closed.length; i++) {
            if(this._closed[i] == node) {
                return true;
            }
        }

        return false;
    }
    
    private diagonal(node:MyNode):number {
        var dx:number = Math.abs(node.x - this._endNode.x);
        var dy:number = Math.abs(node.y - this._endNode.y);
        var diag:number = Math.min(dx, dy);
        var straight:number = dx + dy;
        return this._diagCost * diag + this._straightCost * (straight - 2 * diag);
    }

    public getVisited():MyNode[]{
        return this._closed.concat(this._open);
    }
}