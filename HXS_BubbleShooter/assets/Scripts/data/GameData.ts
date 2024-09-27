import { IGameData } from "./IGameData";
import { Util } from "../util/Util";
import { BallNode } from "./BallNode";
import { GroupMgr } from "./GroupMgr";
import { Color, color, Enum } from "cc";

export enum BALLCOLOR {
    NONE = -1,
    BLUE = 1,
    PINK = 2,
    YELLOW = 3,

};

const OBJCOLOR = {
    "BLUE":1,
    "PINK": 2,
    "YELLOW":3
};

const TEMPCOLORS:Color[] = [color(0,0,0,0),color(0,82,255,100),color(255,0,255,100),color(233,178,0,100)];


export const INITX:number = -10;
export const INITZ:number = 10.2;
export const PERX:number = 1.966;
export const PERZ:number = 1.6;



/** 当行，双行多一般position,0,+1 */
export var INITDATA:number[][] = [
    [2,2,2,2,2,-1,2,3,3],
    [2,1,1,1,2,-1,2,3,2],
    [2,1,1,1,2,-1,2,-1,3],
    [2,1,1,1,2,-1,1,-1],
    [2,1,1,1,2,3,1,3,1],
    [2,1,1,1,2,3,3,3,1],
    [2,1,1,1,2,-1,2,-1,1],
    [2,1,1,1,2,-1,2,-1,-1],
    [2,1,1,1,2,-1,1,3,3],
    [2,2,1,2,2,-1,1,3,1],
    [2,-1,2,-1,2,-1,1,-1,3],
];
export class GameData implements IGameData {
    private ballNodes:BallNode[] = [];      // 这个是所有的Ball的数据, 包括row, column, color.
    
    private groupMgr:GroupMgr;

    private columns:number = 0;             // 列有多少列
    private rows:number = 0;                // 行有多少行


    private fireNodeColor:BALLCOLOR;

    private backNodeColor:BALLCOLOR
    constructor() {
        this.groupMgr = new GroupMgr();
        this.devideGroup();
    }

    createAFireNode() {
        let color:number = Math.ceil(Math.random() * 3);
        this.fireNodeColor = color;
        return color;
    }

    getFireValue() {
        return this.fireNodeColor;
    }

    getFireColor():Color {
        let index:number = this.fireNodeColor;
        if(index < 0) {
            index = 0;
        }
        return TEMPCOLORS[index];
    }

    createABackNode() {
        let color:number = Math.ceil(Math.random() * 3);
        this.backNodeColor = color;
        return color;
    }
    devideGroup(): void {
        // 把数据划分为堆, 堆指的的抱团的一堆...
        this.columns = INITDATA.length;
        for(let i = 0; i < INITDATA.length; i++) {
            let rows = INITDATA[i];
            if(this.rows <= rows.length) {
                this.rows = rows.length;
            }
        }
        for(let i = 0; i <this.columns; i++) {
            let nodes = INITDATA[i];
            for(let j = 0; j < this.rows; j++) {
                let val = nodes[j];
                if(val == undefined) {
                    val = -1;
                }
                let node = new BallNode();
                node.init(i, j, val);
                this.ballNodes.push(node);
            }
        }

        this.groupMgr.devideGroup(INITDATA,this.ballNodes,this.columns,this.rows);
    }

    public getIsGroup(column:number, row:number) {
        let ballNode:BallNode = Util.plainSearchBallNode(column, row, this.ballNodes);
        return ballNode.isInGroup();
    }

    public getGroupNum(column:number, row:number) {
        let bo:boolean = this.getIsGroup(column, row);
        if(bo) {
            let ballNode:BallNode = Util.plainSearchBallNode(column, row, this.ballNodes);
            return ballNode.getGroup()-1;
        }
        return -1;
    }



    /** 获得这个初始化的数据 */
    public getInitData() {
        console.log("hel")
        return INITDATA;
    }
    
}