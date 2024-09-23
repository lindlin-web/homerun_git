import { _decorator, Component, instantiate, Node, tween, Vec2, Vec3 } from 'cc';
import { GroupCode } from './GroupCode';
import { ColorCode } from './ColorCode';
import {GameMain } from './GameMain';
import { AppNotify, NotifyMgrCls } from './controller/AppNotify';
import { ChipColor, CodeDirection, CodeHeight, COLUMNNUM, doubleColumn, MyTableData, ROWNUM, singleColumn } from './data/MyTableData';
import { TailPage } from './TailPage';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    private groups:GroupCode[][] = [];             // 每一堆的节点是什么

    

    private onProcessingGroup:GroupCode[] = [];     // 就是那些正在被处理的那些堆...

    private gameMainRef:GameMain = null;            // 获取一个主界面的引用...

    private myTableData:MyTableData = null;

    public init(gameMain:GameMain) {
        this.gameMainRef = gameMain;
        this.myTableData = new MyTableData();
        this.myTableData.init();
        NotifyMgrCls.getInstance().observe(AppNotify.FlyAnimationDone, this.onAnimationDone.bind(this));
        NotifyMgrCls.getInstance().observe(AppNotify.DeleteDone, this.onDeleteDone.bind(this));
        NotifyMgrCls.getInstance().observe(AppNotify.MovingDone, this.onMovingDone.bind(this));
    }

    private onMovingDone(fromRow,fromColum, toRow,toColumn) {
        let groupA = this.getGroup(fromRow, fromColum);
        let groupB = this.getGroup(toRow, toColumn);
        groupA.setLock(false);
        groupB.setLock(false);

        let finishTime = this.myTableData.setMovingFinish(fromColum);
        this.onProcessingGroup.push(groupB);

        let compactDatas = this.myTableData.getCompactDatasByColumn(fromColum);
        let compactLength = compactDatas.myDataLength();
        if(compactLength == finishTime) {
            for(let i = 0; i < compactLength; i++) {
                let compact = compactDatas.getIndexData(i);
                let fromRow = compact.fromRow;
                let fromColum = compact.fromColumn;
                let toRow = compact.toRow;
                let toColumn = compact.toColumn;
                let groupA = this.getGroup(fromRow, fromColum);
                let groupB = this.getGroup(toRow, toColumn);
                groupB.setGroup(groupA.getGroup());
                groupA.setGroup([]);

                let chips = this.myTableData.getChips(fromRow, fromColum);
                this.myTableData.setChips(toRow,toColumn, chips);
                this.myTableData.setChips(fromRow, fromColum, []);
            }

            this.myTableData.removeColumnMovingMes(fromColum);

            this.check();
        }
    }

    /** 当删除完毕的时候 */
    private onDeleteDone(row:number,column:number) {
        // 在这个地方，需要确认一下，是否有可以拖动的堆，就是每一个列，往后堆起来....

        this.scheduleOnce(this.check.bind(this),0.1);
        console.log("我是否已经做好了删除的工作的呢");

        let group = this.getGroup(row, column);
        this.onProcessingGroup.push(group);
        this.check();
        this.doTheColumnMoveingthing(column);

        TailPage.Instance.plusAdd();
    }

    public isHoldChipsEmpty() {
        return this.myTableData.isHoldChipsEmpth();
    }

    public createGroups() {
        let nodes:Node[][][] = this.gameMainRef.theCodePrefab;          // 直接操作gameMain好了。
        let tableData = this.myTableData.getTableData();
        for(let i = 0; i < tableData.length; i++) {
            this.groups[i] = [];
            let columns = tableData[i];
            for(let j = 0; j < columns.length; j++) {
                let group = new GroupCode();
                group.init(nodes[i][j],i, j);
                this.groups[i][j] = group;
            }
        }
    }

    /** 把手持的那个chips推到堆里面去 */
    public pushHoldChips(row:number, column:number,index:number) {
        this.myTableData.pushHoldChips(row, column,index);
    }


    /** 生成用来移动的那些chips */

    public createHoldChips() {
        let arr = this.myTableData.createHoldChips();
        return arr;
    }
    /** 创建某一个墩子的chips */
    public createChips(row:number, column:number,value:number) {
        let array = this.myTableData.createChipsData(row, column,value);
        return array;       // 创建的筹码 堆，给返回...
    }

    /** 获得某一个墩子的 chips的数据 */
    public getChips(row:number, column:number) {
        let chips = this.myTableData.getChips(row, column);
        return chips;
    }

    public setChips(row:number,column:number,arr:number[]) {
        this.myTableData.setChips(row,column, arr);
    }

    public onAnimationDone(Row:number,Colum:number) {
        // onProcessingGroup 在这个 操作过的节点上，进行，看看，是否有可以被删除的，记住，Group有 checkToDelete的标志....

        // 之前的动作，只是，表现上的动作，需要移动对应的group，更新对应的value....
        // 备忘录上面，有 之前移动过的信息的信息...可以被获取到....
        let note = this.myTableData.getNoteDataByFromRow_Column(Row, Colum);
        let fromRow = note.fromRow;
        let fromColumn = note.fromColum;
        let toRow = note.toRow;
        let toColumn = note.toColumn;
        let color = note.color;
        let num = note.num;

        // ------------------------begin 移动对应的 Node到 对应的group -----------------------------
        let fromGroup:GroupCode = this.getGroup(fromRow, fromColumn);
        fromGroup.setLock(false);
        let deleteNodeArray:Node[] = fromGroup.deleteNumColorFromTail(color, num);
        let toGroup:GroupCode = this.getGroup(toRow, toColumn);
        toGroup.addNumColorToTail(deleteNodeArray);
        // ------------------------end  移动对应的 Node到 对应的group -----------------------------
        
        // -----------------------begin 做数据的移动----------------------------------------------
        this.myTableData.deleteNumColorFromTail(fromRow,fromColumn,color,num);
        this.myTableData.addNumColorToTail(toRow, toColumn, color, num);
        // -----------------------end 做数据的移动----------------------------------------------

        // -----------------------when done  delete the note data -------------------------------
        this.myTableData.deleteNoteDataByRow_Column(Row, Colum);
        // ---------------------------------------------------------------------------------------

        this.checkCircle(toRow, toColumn);              // 再次，确认一下周边.是否有可以被删除的堆...
        //this.checkCanBeDelete(toRow,toColumn);

        this.onProcessingGroup.push(fromGroup);
        this.check();

        this.doTheColumnMoveingthing(Colum);
    }

    /** 一个堆从尾巴被删除掉 */
    private doGroupDeleteThing(row:number, column:number) {
        let group = this.getGroup(row, column);     // 获得这个堆.....
        group.doDeleteThing();
    }

    public deletEffect(node) {
        this.gameMainRef.node.removeChild(node);
    }

    /** processingNode中检查，是否有可以删除的 */
    public checkCanBeDelete(row:number, column:number) {
        let canBeDeleted = this.myTableData.checkCanbeDelete(row, column);
        if(canBeDeleted) {
            this.myTableData.doDeleteThing(row,column);
            this.doGroupDeleteThing(row, column);

            let prefab = this.gameMainRef.theEffect;
            let ins = instantiate(prefab);

            let group = this.getGroup(row, column);     // 获得这个堆.....
            let tail = group.getTailNode();
            let tailPos = tail.getWorldPosition();
            this.gameMainRef.node.addChild(ins);
            ins.setWorldPosition(tailPos);
            this.scheduleOnce(this.deletEffect.bind(this, ins),0.5);
        } else {
            // 如果不能被删除, 把这个堆，解锁，修改delete状态.......
            let group = this.getGroup(row, column);
            group.setCheckToDelete(false);
            group.setLock(false);
            this.check();
        }
    }

    /** 某一个列，做移动的操作 */
    public doTheColumnMoveingthing(column:number) {
        return;
        let checkCanBeMove = true;     // 检查是否可以被移动
        for(let i = 0; i <= ROWNUM - 1; i++) {
            let group = this.getGroup(i, column);
            let isPush = group.getIsPush();
            let isLock = group.getLock();
            if(isPush || isLock) {
                checkCanBeMove = false;
                break;
            }
        }
        if(checkCanBeMove) {
            //this.myTableData.createMovingColumn(column);            // 为某个列创建一个移动的数据...
            for(let i = ROWNUM - 1; i >= 0; i--)
            {
                let group = this.getGroup(i, column);
                if(group.isEmpty()) {
                    continue;
                }
                let moveNum = 0;
                for(let j = i+1; j <= ROWNUM - 1; j++) {
                    let g = this.getGroup(j, column);
                    let isEmpty = g.isEmpty();
                    if(isEmpty) {
                        moveNum++;
                    }
                }
                /** 移动的数据信息 */
                if(moveNum > 0) {
                    this.myTableData.createMovingColumnData(group.getRow(),group.getColumn(), group.getRow()+moveNum, group.getColumn());
                }
            }

            this.doTheGroupMoveing(column);
        }
    }

    /** 两个堆，做一下移动的操作 */
    public doTheGroupMoveing(column:number) {
        let movingDatas = this.myTableData.getCompactDatasByColumn(column);
        if(movingDatas) {
            let compactDatas = movingDatas.myCompactData();
            for(let i = 0; i < compactDatas.length; i++) {
                let compact = compactDatas[i];
                let fromRow = compact.fromRow;
                let fromColumn = compact.fromColumn;
                let toRow = compact.toRow;
                let toColumn = compact.toColumn;
                let groupA = this.getGroup(fromRow, fromColumn);
                let groupB = this.getGroup(toRow, toColumn);
    
                this.doMovingAction(groupA,groupB);
            }    
        }
        
    }

    /** 做组的移动的动作 */
    public doMovingAction(gA:GroupCode, gB:GroupCode) {
        let fromRow = gA.getRow();
        gA.setLock(true);
        let fromColum = gA.getColumn();
        let toRow = gB.getRow();
        gB.setLock(true);
        let toColumn = gB.getColumn();

        let fromPos = this.gameMainRef.getBaseCodePosition(fromRow, fromColum);
        let toPos = this.gameMainRef.getBaseCodePosition(toRow, toColumn);
        
        gA.moveChildrenToTarget(fromPos, toPos, fromRow, fromColum, toRow, toColumn);
    }

    public getBackEmpty(row:number, column:number) {
        let retVal = -1;
        for(let i = row + 1; i <= ROWNUM - 1; i++) {
            let group = this.getGroup(i, column);
            let empty = group.isEmpty();
            if(empty) {
                retVal = i;
                break;
            }
        }
        return retVal;
    }


    /** 确认周边的行和列 */
    public checkCircle(toRow, toColumn) {
        let group = this.getGroup(toRow, toColumn);     // 再次确认一下周边，是否还有可以被删除的堆..
        let row = group.getRow();
        let column = group.getColumn();
        let processMasks = singleColumn;
        if(column % 2 == 0) {
            processMasks = doubleColumn;
        }

        for(let i = 0; i < processMasks.length; i++) {
            let mask = processMasks[i];
            let rowArr = this.groups[row+mask[0]];
            if(rowArr) {
                let groupB = this.groups[row+mask[0]][column+mask[1]];
                // 非空..
                if(!groupB) {
                    continue;
                }
                let isLock = groupB.getLock();
                let together = this.checkCanbeTogether(group, groupB);
                if(!isLock && together) {       // 不是被锁定的，可以被合并，那么就需要被合并起来...
                    group.setLock(true);       // 先锁定
                    groupB.setLock(true);       // 先锁定
                    this.onProcessingGroup.push(groupB);        // 把groupB也纳入到，即将被处理的那块堆之中...
                    this.processTwoGroup(group, groupB);
                    group.setIsPush(false);
                    groupB.setIsPush(false);
                    return;
                }
            }
        }
        this.checkCanBeDelete(toRow,toColumn);
    }

    public getGroup(row:number, column:number):GroupCode {
        return this.groups[row][column];
    }

    /** 推送过来的那些筹码， 刚刚开始的时候肯定是空的，所以，可以直接赋值进去 */
    public setPushGroup(i, j) {
        let nodes = this.gameMainRef.theCodePrefab[i][j];
        let group = this.groups[i][j];
        group.init(nodes,i, j);
        group.setIsPush(true);          // 设置为是推动过来的...
        this.onProcessingGroup.push(group);
        this.check();      // 确认是否有堆可以被合并起来...
    }

    /** push过来的时候第一个堆就是新推动过来的堆，判断是否有可以被合并的. */
    public check() {
        for(let m = this.onProcessingGroup.length - 1; m >= 0; m--) {
            let groupA = this.onProcessingGroup[m];
            if(!groupA) {
                this.onProcessingGroup.splice(m, 1);
                continue;
            }
            let isAlock = groupA.getLock();
            if(isAlock) {
                this.onProcessingGroup.splice(m, 1);
                continue;
            }
            let row = groupA.getRow();
            let column = groupA.getColumn();
            let processMasks = singleColumn;
            if(column % 2 == 0) {
                processMasks = doubleColumn;
            }
            for(let i = 0; i < processMasks.length; i++) {
                let mask = processMasks[i];
                let rowArr = this.groups[row+mask[0]];
                if(rowArr) {
                    let groupB = this.groups[row+mask[0]][column+mask[1]];
                    // 非空..
                    if(!groupB) {
                        continue;
                    }
                    let isLock = groupB.getLock();
                    let together = this.checkCanbeTogether(groupA, groupB);
                    if(!isLock && together) {       // 不是被锁定的，可以被合并，那么就需要被合并起来...
                        groupA.setLock(true);       // 先锁定
                        groupB.setLock(true);       // 先锁定
                        this.onProcessingGroup.push(groupB);        // 把groupB也纳入到，即将被处理的那块堆之中...
                        this.processTwoGroup(groupA, groupB);
                        groupA.setIsPush(false);
                        groupB.setIsPush(false);
                        return;
                    }
                }
            }
            this.onProcessingGroup.splice(m, 1);
            groupA.setIsPush(false);
        }
        console.log("==============清空一下===============");
        this.onProcessingGroup = [];
    }

    private processTwoGroup(groupA:GroupCode, groupB:GroupCode) {
        let together = this.checkCanbeTogether(groupA, groupB);     // 再次做一下，是否可以被合并的判断。虽然有点多余...
        if(together) {
            // 如果到了这里，说明说已经有相同的部分需要移动了。
            let isApush = groupA.getIsPush();
            // 如果都不是推送过来的，那么就要判断，那个多，那个少， 少的 叠到多的上面去...

            // let numA = groupA.getTailNum();         // 判断，叠在上面的同一颜色的 筹码有几张....
            // let numB = groupB.getTailNum();

            let numA = this.myTableData.getTailNum(groupA.getRow(), groupA.getColumn());
            let numB = this.myTableData.getTailNum(groupB.getRow(), groupB.getColumn());

            if(isApush) {
                this.moveFrom1to2(groupB, groupA,numB);
                return;
            }
            let isBpush = groupB.getIsPush();
            if(isBpush) {
                this.moveFrom1to2(groupA, groupB,numA);
                return;
            }
            
            if(numA > numB) {
                this.moveFrom1to2(groupB, groupA,numB);
            }
            else {
                this.moveFrom1to2(groupA, groupB,numA);
            }
        }
    }

    /** 把A移动到B */
    private moveFrom1to2(groupA:GroupCode,groupB:GroupCode,num:number) {
        //如果确定是有筹码，会飘动，就需要去监听，动画完成的事件....
        groupA.listenToFlyAnimationDone(groupA.getRow(),groupA.getColumn());
        groupB.listenToFlyAnimationDone(groupA.getRow(),groupA.getColumn());



        let bTail:Node = groupB.getTailNode();
        if(!bTail) {
            console.error("===============xxxxxxxxxxxxxxxxx");
        }

        // 创建一个备忘录..
        let fromRow = groupA.getRow();
        let fromColumn = groupA.getColumn();
        let toRow = groupB.getRow();
        let toColumn = groupB.getColumn();
        let color:ChipColor = bTail.getComponent(ColorCode).getColor();
        this.myTableData.createNoteData(fromRow,fromColumn,toRow,toColumn,color,num);
        // 结束创建一个备忘录..





        let worldPosB = bTail.getWorldPosition();        // 获得最后一个节点的坐标..
        let aTail:Node = groupA.getTailNode();
        let worldPosA = aTail.getWorldPosition();           // 获得A节点的世界坐标...
        let gap:Vec3 = worldPosB.clone().subtract(worldPosA).normalize();
        let vec:Vec2 = new Vec2(gap.x, gap.z);
        let radian = Math.atan2(vec.y, vec.x) * 180 / Math.PI;
        let dic:CodeDirection = CodeDirection.Down;
        if(radian > 12 && radian < 78) {
            dic = CodeDirection.RightDown;
        }
        else if(radian > 78 && radian < 102) {
            dic =  CodeDirection.Down;
        }
        else if(radian > 102 && radian < 168) {
            dic = CodeDirection.LeftDown;
        }
        else if(radian > -180 && radian < -108) {
            dic = CodeDirection.LeftUp;
        } 
        else if(radian > -180 && radian < -79) {
            dic = CodeDirection.Up;
        }
        else if(radian >-79 && radian < -12) {
            dic = CodeDirection.RightUp;
        }

        for(let i = 0; i < num; i++) {
            groupB.setCheckToDelete(true);
            let node = groupA.getTailIndexNode(i);
            let targetPos = new Vec3(worldPosB.x,worldPosB.y + CodeHeight*(i+1), worldPosB.z);
            this.scheduleOnce(this.moveOneNodeToTarget.bind(this,node,targetPos,dic,i,num,groupA.getRow(),groupA.getColumn()), 0.09 * i);
        }
    }



    private moveOneNodeToTarget(node:Node, targetPos:Vec3, dir:CodeDirection,index:number, total:number,row:number,column:number) {
        let tell = false;           // 发送一个通知的事件....如果动画已经结束的话，发送一次通知事件...
        if(index + 1 == total) {
            tell = true;
        }
        node.getComponent(ColorCode).doMove(targetPos, dir, tell,row,column);
    }

    /** 推送结束的时候，执行对应的操作，检查是否可以叠起来 */
    // public doThePushDoneProcess() {
    //     let groupA = this.groups[row][column];      // 取出，推动过来的这个堆...
    //     for(let i = 0; i < this.processMasks.length; i++) {
    //         let mask = this.processMasks[i];
    //         let groupB = this.groups[row+mask[0]][column+mask[1]];
    //         let isLock = groupB.getLock();
    //         let together = this.checkCanbeTogether(groupA, groupB);
    //         if(!isLock && together) {       // 不是被锁定的，可以被合并，那么就需要被合并起来...

    //         }
    //     }
    // }

    /** 检查是否可以被合并 */
    private checkCanbeTogether(groupA:GroupCode, groupB:GroupCode):boolean {
        let valuesA = this.myTableData.getChips(groupA.getRow(),groupA.getColumn());
        let valuesB = this.myTableData.getChips(groupB.getRow(),groupB.getColumn());
        if(!valuesA) {
            return false;
        }
        if(!valuesB) {
            return false;
        }
        if(valuesA.length < 1) {
            return false;
        }

        if(valuesB.length < 1) {
            return false;
        }
        let tailValueA = valuesA[valuesA.length - 1];           // 叠堆的，最后一个筹码，是否，跟第二个叠堆的筹码一样的....
        let tailValueB = valuesB[valuesB.length - 1];
        let retValue:boolean = false;
        if(tailValueA == tailValueB) {
            retValue = true;
        }
        return retValue;
    }   
}


