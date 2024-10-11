import { IGameData } from "./IGameData";
import { Util } from "../util/Util";
import { BallNode } from "./BallNode";
import { GroupMgr } from "./GroupMgr";
import { Color, color, Enum, v2, v3, Vec2, Vec3 } from "cc";
import { AppNotify, NotifyMgrCls } from "../controller/AppNotify";
import { Grid } from "../AStar/Grid";
import { AStar } from "../AStar/AStar";

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


export const INITX:number = -25.5;
export const INITZ:number = 13.7;

export const PERX:number = 1.966;
export const PERZ:number = 1.6;


/** 后续用来支持的那些弄得 */
var SUPPORT:number[][] =  [

    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,],
    [ 1, 1, 3, 3, 1, 3, 3, 3, 3, 3, 1, 1, 3, 3, 3, 3, 1, 3, 3, 1, 3, 3, 3, 3, 3, 1, 3, 1, 3, 3, 3, 3, 3, 1, 1, 3, 3, 1, 3, 3, 3, 3, 3, 1,-1,-1,],
    [ 1, 3, 3, 1, 3, 3, 1, 1, 2, 1, 3, 1, 1, 1, 3, 3, 3, 3, 1, 3, 3, 1, 1, 2, 1, 3, 1, 3, 3, 1, 1, 2, 1, 3, 3, 3, 1, 3, 3, 1, 1, 2, 1, 3, 1,-2,],
    [-1, 2, 3, 3, 2, 3, 3, 3,-1, 3, 2,-1, 3, 3, 3, 3, 2, 3, 3, 2, 3, 3, 3,-1, 3, 2, 3, 2, 3, 3, 3,-1, 3, 2, 2, 3, 3, 2, 3, 3, 3,-1, 3, 2,-1,-1,],
    [-1, 2, 3, 2, 2, 3, 2, 2, 1, 2, 2,-1, 2, 2, 3, 3, 2, 3, 2, 2, 3, 2, 2, 1, 2, 2, 2, 2, 3, 2, 2, 1, 2, 2, 2, 3, 2, 2, 3, 2, 2, 1, 2, 2,-1,-1,],
    [ 1, 2,-1, 3, 2,-1, 3, 3, 2, 3, 2, 1, 3, 3,-1,-1, 2,-1, 3, 2,-1, 3, 3, 2, 3, 2, 3, 2,-1, 3, 3, 2, 3, 2, 2,-1, 3, 2,-1, 3, 3, 2, 3, 2,-1,-1,],
    [ 1, 1,-1,-1, 1,-1,-1,-1, 3,-1, 1, 1,-1,-1,-1,-1, 1,-1,-1, 1,-1,-1,-1, 3,-1, 1,-1, 1,-1,-1,-1, 3,-1, 1, 1,-1,-1, 1,-1,-1,-1, 3,-1, 1,-1,-1,],
    [ 1, 1, 3, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 1, 3, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 3, 1, 1, 3, 1, 1, 1, 1, 2,-1,-1,],
    [ 1, 3, 3, 1, 3, 3, 1, 1, 2, 1, 3, 1, 1, 1, 3, 3, 3, 3, 1, 3, 3, 1, 1, 2, 1, 3, 1, 3, 3, 1, 1, 2, 1, 3, 3, 3, 1, 3, 3, 1, 1, 2, 1, 3, 1,-2,],
    [ 1, 2,-1, 1, 2,-1, 1, 1, 3, 1, 2, 1, 1, 1,-1,-1, 2,-1, 1, 2,-1, 1, 1, 3, 1, 2, 1, 2,-1, 1, 1, 3, 1, 2, 2,-1, 1, 2,-1, 1, 1, 3, 1, 2, 1,-1,],
    [ 1, 2,-1,-1, 2,-1,-1,-1,-1,-1, 2, 1,-1,-1,-1,-1, 2,-1,-1, 2,-1,-1,-1,-1,-1, 2,-1, 2,-1,-1,-1,-1,-1, 2, 2,-1,-1, 2,-1,-1,-1,-1,-1, 2,-1,-1,],
    [ 1, 1, 3, 3, 1, 3, 3, 3, 3, 3, 1, 1, 3, 3, 3, 3, 1, 3, 3, 1, 3, 3, 3, 3, 3, 1, 3, 1, 3, 3, 3, 3, 3, 1, 1, 3, 3, 1, 3, 3, 3, 3, 3, 1,-1,-1,],
    [-1, 1, 3, 1, 1, 3, 1, 1, 1, 1, 1,-1, 2, 2, 3, 3, 1, 3, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 3, 1, 1, 3, 1, 1, 1, 1, 1,-1,-1,],
    [-1, 1,-1, 3, 1,-1, 3, 3, 3, 3, 1,-1, 2, 2,-1,-1, 1,-1, 3, 1,-1, 3, 3, 3, 3, 1, 3, 1,-1, 3, 3, 3, 3, 1, 1,-1, 3, 1,-1, 3, 3, 3, 3, 1,-1,-1,],
    [ 1, 1, 3, 3, 1, 3, 3, 3, 3, 3, 1, 1, 3, 3, 3, 3, 1, 3, 3, 1, 3, 3, 3, 3, 3, 1, 3, 1, 3, 3, 3, 3, 3, 1, 1, 3, 3, 1, 3, 3, 3, 3, 3, 1,-1,-1,],
    [ 1, 1, 3, 3, 1, 3, 3, 3, 3, 3, 1, 1, 3, 3, 3, 3, 1, 3, 3, 1, 3, 3, 3, 3, 3, 1, 3, 1, 3, 3, 3, 3, 3, 1, 1, 3, 3, 1, 3, 3, 3, 3, 3, 1,-1,-1,],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,],


]

/** 当行，双行多一般position,0,+1 */
var INITDATA:number[][] = [

                                                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,],
                                                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,],
                                                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,],
                                                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,],
                                                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,],
                                                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,],
                                                [-1,-1, 2, 3, 3, 3, 3, 1, 3, 3, 1, 1,],
                                                [-1,-1, 2, 3, 3, 3, 3, 1, 3, 3, 1, 1,],
                                                [-1,-1,-1, 1,-1, 2, 3, 3, 2, 3, 3, 3,],
                                                [-1,-1,-1, 2,-1, 2, 3, 2, 2, 3, 2, 2,],
                                                [-1,-1, 2, 3,-1, 2,-1, 3, 2,-1, 3, 3,],
                                                [-1,-1, 2, 1,-1, 1,-1,-1, 1,-1,-1,-1,],
                                                [-1,-1, 2, 2, 3, 1, 3, 1, 1, 3, 1, 1,],
/**------> 这里看进去**/                         [-1,-1, 2, 3, 3, 3, 3, 1, 3, 3, 1, 1,],
                                                [-1,-1,-1, 1,-1, 2,-1, 1, 2,-1, 1, 1,],
                                                [-1,-1,-1, 3,-1, 2,-1,-1, 2,-1,-1,-1,],
                                                [-1,-1,-1, 1,-1, 1, 3, 3, 1, 3, 3, 3,],
                                                [-1,-1,-1, 1,-1, 1, 3, 1, 1, 3, 1, 1,],
                                                [-1,-1,-1, 1,-1, 1,-1, 3, 1,-1, 3, 3,],
                                                [-1,-1,-1, 1,-1, 1, 3, 3, 1, 3, 3, 3,],
                                                [-1,-1, 2, 3,-1, 2,-1, 3, 2,-1, 3, 3,],
                                                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,],
                                                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,],
                                                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,],
                                                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,],
                                                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,],
                                                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,],
    
];

export class GameData implements IGameData {
    private ballNodes:BallNode[] = [];      // 这个是所有的Ball的数据, 包括row, column, color.
    
    private groupMgr:GroupMgr;

    private columns:number = 0;             // 列有多少列
    private rows:number = 0;                // 行有多少行


    private fireNodeColor:BALLCOLOR;

    private backNodeColor:BALLCOLOR;

    private zeroPosition:Vec3 = v3(INITX, 0.1, INITZ);

    private preDeleteGroup:number = -1;         // 之前被删除的那个组是什么...


    private _grid:Grid;

    constructor() {
        this.devideGroup();
    }

    createAFireNode() {
        let color:number = Math.ceil(Math.random() * 3);
        color = 2;
        this.fireNodeColor = color;
        return color;
    }

    /** 发射的颜色. */
    getFireValue() {
        return this.fireNodeColor;
    }

    /** 备用的颜色 */
    getBackValue() {
        return this.backNodeColor;
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
        this.groupMgr = new GroupMgr();
        // 把数据划分为堆, 堆指的的抱团的一堆...
        this.ballNodes = [];
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
                if(val >= 0) {
                    console.log("====hello");
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
            return ballNode.getGroup();
        }
        return -1;
    }

    /** 这个组的组队成员有多少个  == 1 个不用删除， > 1 做删除 */
    public howManyGoupMember(groupNum:number):number {
        var count:number = 0;
        for(let i = 0; i < this.ballNodes.length; i++) {
            let ballNode:BallNode = this.ballNodes[i];
            if(ballNode.getGroup() == groupNum) {
                count++;
            }
        }

        return count;
    }

    public getValueByColumnAndRow(column:number, row:number):number {
        let rows = INITDATA[column];
        if(!rows) {
            console.log("hehhh");
            return -1;
        }
        let val = INITDATA[column][row];
        if(val == undefined) {
            return -1;
        }
        return val;
    }


    private needDropGroup(groupVals:number[]):void {
        let dropBalls:Vec2[] = [];
        for(let i = 0; i < groupVals.length; i++) {
            let gv = groupVals[i];
            for(let i = 0; i < this.ballNodes.length; i++) {
                let ball:BallNode = this.ballNodes[i];
                if(ball.getGroup() == gv) {
                    let v:Vec2 = v2(ball.getColumn(), ball.getRow());
                    dropBalls.push(v);
                }
            }
        }

        
        console.log("=====================before drop==================");
        this.getInitData();
        // 删除掉这些node...
        for(let i = 0; i < dropBalls.length; i++) {
            let v2:Vec2 = dropBalls[i];
            let x = Math.floor(v2.x);
            let y = Math.floor(v2.y);

            INITDATA[x][y] = -1;
        }
        console.log("====================after drop========================");
        this.getInitData();
        NotifyMgrCls.getInstance().send(AppNotify.DROPBUBBLEDONE, dropBalls);

        // 然后这个时候，是可以去检查一下，删除掉了有多少的行. 然后在 SUPPORT队列里面补充几个行进去...
        this.checkHowManyRowHaveDeleted();
    }

    public needDeleteGroup(groupVal:number):void {
        this.preDeleteGroup = groupVal;                 // 之前被删除的那个组的信息是什么。 这样为了做掉落的时候，不要多计算一次...
        let deleteGroup:Vec2[] = [];

        console.log("========before delete group ========================")
        this.getInitData();
        for(let i = 0; i < this.ballNodes.length; i++) {
            let ball:BallNode = this.ballNodes[i];
            if(ball.getGroup() == groupVal) {
                let v:Vec2 = v2(ball.getColumn(), ball.getRow());
                deleteGroup.push(v);
            }
        }
        // 删除掉这些node...

        
        for(let i = 0; i < deleteGroup.length; i++) {
            let v2:Vec2 = deleteGroup[i];

            INITDATA[v2.x][v2.y] = -1;
        }

        console.log("============after delete group ====================");
        this.getInitData();

        console.log("======================delteGroup value ===", deleteGroup);
        NotifyMgrCls.getInstance().send(AppNotify.DELETEBUBBLEDONE, deleteGroup);

    }


    public getPositionByColumnAndRow(column:number, row:number, totalDeleteRow:number):Vec3 {
        let gap = 1;
        row = row + totalDeleteRow;
        if(row % 2 == 0) {
            gap = 0;
        } 
        let pos:Vec3 = v3(this.zeroPosition.x +column*PERX +gap,0.1, this.zeroPosition.z - row * PERZ);
        return pos;
    }

    public getSupport():number[][] {
        return SUPPORT;
    }

    /*** 如果有掉落的话，返回false，没有掉落，返回true */
    public checkTheDropThing():boolean {
        this._grid = new Grid(INITDATA.length, INITDATA[0].length,INITDATA);
        let groups = this.groupMgr.getGroupValues();
        let deleteGroups:number[] = [];             // 这个是组要被删除的组队信息...
        for(let i = 0; i < groups.length; i++) {
            let group = groups[i];
            if(group != this.preDeleteGroup) {
                let isConnect = false;              // 如果是连接的，说明就不会掉落，就不会被删除..
                for(let k = 0; k < this.ballNodes.length; k++) {
                    let ball = this.ballNodes[k];
                    if(ball.getGroup() == group) {
                        for(let m = 0; m < INITDATA.length; m++) {
                            let lastVal = INITDATA[m][INITDATA[m].length - 1];
                            if(lastVal != -1) {
                                this._grid.setStartNode(ball.getColumn(),ball.getRow());
                                this._grid.setEndNode(m, INITDATA[m].length - 1);
                                var astar:AStar = new AStar();
                                isConnect = astar.findPath(this._grid);
                                if(isConnect) {
                                    break;
                                }
                            }
                        }
                        break;
                    }
                }
                if(isConnect) {
                    console.log(' 这个组不能被删除 ')
                }
                else {
                    deleteGroups.push(group);
                }
            }
        }    
        let retVal:boolean = true;
        if(deleteGroups && deleteGroups.length) {
            retVal = false;
            this.needDropGroup(deleteGroups);
        }
        return retVal;
    }

    /** 看看是否有后续可以的补给 */
    public checkToSupport():Vec2 {
        let deleteCount:number = this.checkHowManyRowHaveDeleted();
        deleteCount -= 2;       // 留下两行数据下来...
        let totalSupportRow:number = 0;
        if(deleteCount > 0) {
            
            console.log("============before support============");
            this.getInitData();
            // 1*. 把Support 数据 填充进INITDATA数据中...
            for(let i = 0; i < deleteCount && i < SUPPORT[0].length; i++) {

                for(let j = 0; j < SUPPORT.length; j++) {
                    let supportVal = SUPPORT[j][i];
                    INITDATA[j].push(supportVal);
                }
                totalSupportRow++;
            }

            console.log("===============after support ============");
            this.getInitData();

            console.log("====================before shift==============");
            this.getInitData();

            // 2*. 把INITDATA中的数据，前面的行删除.
            // 3*. 把SUPPORT中的数据，前面的行删除.
            for(let i = 0; i < totalSupportRow; i++) {
                for(let j = 0; j < INITDATA.length;j++) {
                    INITDATA[j].shift();
                    //SUPPORT[j].shift();           // 先别删除供给，等熏染完成之后在做这一步..
                }
            }
            console.log("===================after shift=================");
            this.getInitData();
            return v2(deleteCount, totalSupportRow);        // 返回删除了多少行， 添加了多少行的数据...
        }
        return v2(0, 0);        // 返回删除了多少行， 添加了多少行的数据...
    }

    public deleteTheSupportByRow(rowNum:number):void {
        for(let i = 0; i < rowNum; i++) {
            for(let j = 0; j < SUPPORT.length;j++) {
                SUPPORT[j].shift();
            }
        }
    }

   
    public insertAFiringNode(column:number, row:number):void  {

        console.log("==========================insert begin===========================");
        this.getInitData();
        console.log("====inert column=" + column + ", row=" +row + ", value=", this.fireNodeColor);
        INITDATA[column][row] = this.fireNodeColor;
        this.getInitData();
        console.log("==========================insert end===========================");

        NotifyMgrCls.getInstance().send(AppNotify.INSERTBUBBLEDONE, column, row);
    }

    public getGroupVals():number[] {
        return this.groupMgr.getGroupValues();
    }

    /** 获得这个初始化的数据 */
    public getInitData() {
        let str = "";
        for(let i = 0; i < INITDATA.length; i++) {
            for(let j = 0; j < INITDATA[0].length; j++) {
                if(INITDATA[i][j] > 0) {
                    str += " " + INITDATA[i][j] + ",";
                }
                else {
                    str += "" + INITDATA[i][j] + ",";
                }
                
            }
            str += "\n";
        }
        console.log(str);
        return INITDATA;
    }

    public changeTheCircle() {
        this.fireNodeColor = this.backNodeColor;            // 把备用的变成正式的节点...
        this.createABackNode();                             
    }


    private checkHowManyRowHaveDeleted():number {
        let rowCount:number = 0;
        for(let i = 0; i < INITDATA[0].length; i++) {
            let isOverRow:boolean = true;
            for(let j = 0; j < INITDATA.length; j++) {
                let val = INITDATA[j][i];
                if(val != -1) {
                    isOverRow = false;
                    break;
                }
            }
            if(isOverRow) {
                rowCount ++;
            }
        }
        return rowCount;
    }
    
}
