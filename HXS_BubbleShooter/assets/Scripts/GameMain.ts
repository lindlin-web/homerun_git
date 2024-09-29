import { _decorator, Component, instantiate, Node, Prefab, v3, Vec3 } from 'cc';
import { Grid } from './AStar/Grid';
import { AStar } from './AStar/AStar';
import { MyNode } from './AStar/MyNode';
import { IGameData } from './data/IGameData';
import { GameData } from './data/GameData';
const { ccclass, property } = _decorator;

@ccclass('GameMain')
export class GameMain extends Component {

    private _grid:Grid;


    @property({type:[Prefab]})
    prefabs:Prefab[] = [];

    @property({type:[Prefab]})
    groupsPre:Prefab[] = [];

    @property({type:Node})
    father:Node;

    private nodes:Node[][] = [];

    private gameData:IGameData;


    start() {
        this.gameData = new GameData();
        let initData = this.gameData.getInitData();
        let columns = initData.length;
        let rows = 0;
        for(let i = 0; i < columns; i++) {
            let length = initData[i].length;
            if(length > rows) {
                rows = length;
            }
        }
        this._grid = new Grid(columns, rows,initData);
        this._grid.setStartNode(0, 1);
        this._grid.setEndNode(0, 8);
        this.drawGrid();
        this.findPath();
    }

    reDraw() {
        this.father.removeAllChildren();
        this.nodes = [];
        //this.gameData = new GameData();
        this.gameData.devideGroup();
        let initData = this.gameData.getInitData();
        let columns = initData.length;
        let rows = 0;
        for(let i = 0; i < columns; i++) {
            let length = initData[i].length;
            if(length > rows) {
                rows = length;
            }
        }
        this._grid = new Grid(columns, rows,initData);
        this._grid.setStartNode(0, 1);
        this._grid.setEndNode(0, 8);
        this.drawGrid();
        this.findPath();
        this.getGroup();
    }

    

    drawGrid():void {
        for(let i:number = 0; i < this._grid.getNumCols(); i++) {
            this.nodes[i] = [];
            for(let j:number = 0; j <this._grid.getNumRows(); j++) {
                let myNode = this._grid.getNode(i, j);
                let val = myNode.value;
                let pre:Prefab = this.prefabs[0]
                if(val == 1) {
                    pre = this.prefabs[1];
                } else if(val == 2) {
                    pre = this.prefabs[2];
                } else if(val == 3) {
                    pre = this.prefabs[3];
                }
                if(val == -1) {
                    continue;
                }
                let node  = instantiate(pre);
                this.father.addChild(node);
                this.nodes[i][j] = node;
                let gap = 15;
                if(j % 2 == 0) {
                    gap = 0;
                } 
                let pos:Vec3 = v3(i*30-140 + gap,j*30, 0);
                node.setPosition(pos);
            }
        }
    }

    findPath():void {
        var astar:AStar = new AStar();
        if(astar.findPath(this._grid)) {
            var path = astar.getPath();
            for(let i:number = 0; i < path.length; i++) {
                let myNode:MyNode = path[i];
                let _x = myNode.x;
                let _y = myNode.y;
                let tempNode = this.nodes[_x][_y];
                let pos = tempNode.getPosition();
                tempNode.removeFromParent();
                let pre:Node = instantiate(this.groupsPre[0]);
                this.father.addChild(pre);
                pre.setPosition(pos);
            }
        }
    }

    update(deltaTime: number) {
        
    }

    getGroup() {
        for(let i = 0; i < this._grid.getNumCols(); i++) {
            for(let j = 0; j < this._grid.getNumRows(); j++) {
                let bo = this.gameData.getIsGroup(i, j);
                if(bo) {
                    let gv:number = this.gameData.getGroupNum(i, j);
                    let pre:Prefab = this.groupsPre[gv];
                    let node = this.nodes[i][j];
                    if(!node) {
                        console.log(i,"==", j, "============");
                        continue;
                    }
                    let pos:Vec3 = node.getPosition();
                    let temp = instantiate(pre);
                    temp.setPosition(pos);
                    this.father.addChild(temp);
                }
            }
        }
    }
}


