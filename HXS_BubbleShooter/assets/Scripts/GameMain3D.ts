import { _decorator, Component, instantiate, Node, Prefab, v3, Vec3 } from 'cc';
import { IGameData } from './data/IGameData';
import { GameData } from './data/GameData';
import { Grid } from './AStar/Grid';
const { ccclass, property } = _decorator;

@ccclass('GameMain3D')
export class GameMain3D extends Component {


    private _grid:Grid;
    @property({type:[Prefab]})
    prefabs:Prefab[] = [];

    private gameData:IGameData = null;

    private nodes:Node[][] = [];

    protected onLoad(): void {
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
                    pre = this.prefabs[2];
                }
                if(val == -1) {
                    continue;
                }
                let node  = instantiate(pre);
                this.node.addChild(node);
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

    
    start() {

    }

    update(deltaTime: number) {
        
    }
}


