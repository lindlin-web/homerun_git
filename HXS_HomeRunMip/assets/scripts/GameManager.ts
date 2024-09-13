import { _decorator, Component, Node, Vec2, Vec3 } from 'cc';
import { GroupCode } from './GroupCode';
import { ColorCode } from './ColorCode';
import { CodeDirection, CodeHeight } from './GameMain';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    private groups:GroupCode[][] = [];             // 每一堆的节点是什么

    // 四周的堆....
    private processMasks:number[][] = [[1,0],[-1,0],[0,1],[0,-1],[-1,1],[-1,-1]];

    private onProcessingGroup:GroupCode[] = [];     // 就是那些正在被处理的那些堆...

    public init(values:number[][][], nodes:Node[][][]) {
        for(let i = 0; i < values.length; i++) {
            this.groups[i] = [];
            let row = values[i];
            for(let j = 0; j < row.length; j++) {
                let groupValue = row[j];
                let group = new GroupCode();
                group.init(nodes[i][j], groupValue,i, j);
                this.groups[i][j] = group;
            }
        }
    }

    public getGroup(row:number, column:number):GroupCode {
        return this.groups[row][column];
    }

    /** 推送过来的那些筹码， 刚刚开始的时候肯定是空的，所以，可以直接赋值进去 */
    public setPushGroup(values:number[], nodes:Node[],i, j) {
        let group = this.groups[i][j];
        group.init(nodes,values,i, j);
        group.setIsPush(true);          // 设置为是推动过来的...
        this.onProcessingGroup.unshift(group);
        this.check();      // 确认是否有堆可以被合并起来...
    }

    /** push过来的时候第一个堆就是新推动过来的堆，判断是否有可以被合并的. */
    public check() {
        for(let m = 0; m < this.onProcessingGroup.length; m++) {
            let groupA = this.onProcessingGroup[m];
            if(!groupA) {
                continue;
            }
            let isAlock = groupA.getLock();
            if(isAlock) {
                continue;
            }
            let row = groupA.getRow();
            let column = groupA.getColumn();
            for(let i = 0; i < this.processMasks.length; i++) {
                let mask = this.processMasks[i];
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
                        groupA.setLock(true);
                        groupB.setLock(true);
                        this.onProcessingGroup.push(groupB);        // 把groupB也纳入到，即将被处理的那块堆之中...
                        this.processTwoGroup(groupA, groupB);
                        return;
                    }
                }
            }
        }
    }

    private processTwoGroup(groupA:GroupCode, groupB:GroupCode) {
        let together = this.checkCanbeTogether(groupA, groupB);     // 再次做一下，是否可以被合并的判断。虽然有点多余...
        if(together) {
            let isApush = groupA.getIsPush();
            // 如果都不是推送过来的，那么就要判断，那个多，那个少， 少的 叠到多的上面去...
            let numA = groupA.getTailNum();         // 判断，叠在上面的同一颜色的 筹码有几张....
            let numB = groupB.getTailNum();
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
        let bTail:Node = groupB.getTailNode();
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
            dic = CodeDirection.LeftUp;
        }

        for(let i = 0; i < num; i++) {
            let node = groupA.getTailIndexNode(i);
            let targetPos = new Vec3(worldPosB.x,worldPosB.y + CodeHeight*(i+1), worldPosB.z);
            this.scheduleOnce(this.moveOneNodeToTarget.bind(this,node,targetPos,dic), 0.1 * i);
        }
    }



    private moveOneNodeToTarget(node:Node, targetPos:Vec3, dir:CodeDirection) {
        node.getComponent(ColorCode).doMove(targetPos, dir);
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
        let valuesA = groupA.getValues();
        let valuesB = groupB.getValues();
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


