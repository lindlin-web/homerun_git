import { Vec2 } from "cc";
import { Util } from "../util/Util";
import { BallNode } from "./BallNode";

export enum SEARCHDIRECTION {
    UPRIGHT = 0,
    UPLEFT = 1,
    LEFT = 2,
    DOWNLEFT = 3,
    DOWNRIGHT = 4,
    RIGHT = 5
};


export class GroupMgr {
    private groups:number[] = [];

    private ballNodesRef:BallNode[] = null;
    private dealingNodes:BallNode[] = [];           // 正在处理的节点信息...

    /** 把node划分为组 */
    public devideGroup(theData:number[][],ballNodes:BallNode[],columns:number, rows:number) {
        this.ballNodesRef = ballNodes;                                      // 节点...
        for(let i = 0; i < ballNodes.length; i++) {
            let ballNode = ballNodes[i];
            if(ballNode.getGroup() == -1 && ballNode.getColor() >= 0) {
                // 如果还没有组队
                this.processBallNode(ballNode,-1);          //  就是靠这个节点寻找自己同样的颜色的节点..
            }
        }
        
    }
    /** 处理这个BallNode节点 */
    private processBallNode(ballNode:BallNode,groupMsg:number) {
        // 首先给他先安排组队.
        if(groupMsg == -1) {
            let value = this.createGroup();
            ballNode.setGroup(value);
            
        } else {
            ballNode.setGroup(groupMsg);        // 递归的方法来解决这个问题.
        }

        this.dealingNodes.push(ballNode);
        for(let i = 0; i <= SEARCHDIRECTION.RIGHT; i++) {
            let row = ballNode.getRow();        // 双行和单行的区别要体现出来..
            let column = ballNode.getColumn();      // 所在的列...
            let targetColumnAndRow:Vec2 = Util.getColumnAndRowByDirection(column, row, i);
            let targetBallNode = Util.plainSearchBallNode(targetColumnAndRow.x, targetColumnAndRow.y,this.ballNodesRef);
            if(targetBallNode) {
                let inProcessing = this.isInProcessing(targetBallNode);     // 这个节点是否是在处理中的节点，如果是就不做处理了....
                let isIn = targetBallNode.isInGroup();
                let equal = ballNode.getColor() == targetBallNode.getColor();
                if(!inProcessing && !isIn && equal) {                       // 没有在处理中，并且没有组队，并且颜色值是相等的。。。
                    this.processBallNode(targetBallNode, ballNode.getGroup());
                }
            }
        }
        this.dealingNodes.pop();
    }

    public createGroup() {
        if(this.groups.length == 0) {
            this.groups.push(1);
        }
        else {
            let index = this.groups[this.groups.length - 1];
            index += 1;
            this.groups.push(index);
        }
        return this.groups[this.groups.length - 1];
    }

    /**** 这个节点是否还在处理当中 */
    private isInProcessing(ballNode:BallNode) {
        let retVal:boolean = false;
        for(let i = 0; i < this.processBallNode.length; i++) {
            let targetNode = this.processBallNode[i];
            if(targetNode == ballNode) {
                retVal = true;
                break;
            }
        }
        return retVal;
    }

    public getGroupValues():number[] {
        return this.groups;
    }


    /** 在所有的节点中，寻找BallNode */
    private findBallNodesInRef(column:number, row:number):BallNode {
        let targetBallNode:BallNode = null;
        for(let i = 0; i < this.ballNodesRef.length; i++) {
            let ballNode = this.ballNodesRef[i];
            let myColumn:number = ballNode.getColumn();
            let myRow:number = ballNode.getRow();
            if(myColumn == column && myRow == row) {
                targetBallNode = ballNode;
                break;
            }
        }
        return targetBallNode;
    }
}