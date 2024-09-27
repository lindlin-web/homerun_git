import { MyNode } from "./MyNode";

export class Grid {
    private _startNode:MyNode;
    private _endNode:MyNode;
    private _nodes:MyNode[][] = [];
    private _numCols:number;
    private _numRows:number;

    public constructor(numCols:number, numRows:number,nodes:number[][]) {
        this._numCols = numCols;
        this._numRows = numRows;
        this._nodes = [];
        for(let i:number = 0; i < this._numCols; i++) {
            this._nodes[i] = [];
            for(let j:number = 0; j < this._numRows; j++) {
                let val = nodes[i][j];
                if(val == undefined) {
                    val = -1;
                }
                this._nodes[i][j] = new MyNode(i,j,val);
            }
        }
    }

    public getNode(x:number, y:number):MyNode {
        if(x < 0) {
            return null;
        }
        if(y <0) {
            return null;
        }
        if(!this._nodes[x]) {
            return null;
        }
        return this._nodes[x][y] as MyNode;
    }

    public setEndNode(x:number, y:number):void {
        this._endNode = this._nodes[x][y] as MyNode;
    }

    public setStartNode(x:number, y:number):void {
        this._startNode = this._nodes[x][y] as MyNode;
    }

    public setWalkable(x:number, y:number, value:boolean):void {
        this._nodes[x][y].walkable = value;
    }

    public getEndNode():MyNode {
        return this._endNode;
    }

    public getNumCols():number {
        return this._numCols;
    }

    public getNumRows():number {
        return this._numRows;
    }
    public getStartNode():MyNode{
        return this._startNode;
    }

    
}