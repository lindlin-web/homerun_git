import { v2, Vec2 } from "cc";
import { BallNode } from "../data/BallNode";
import { SEARCHDIRECTION } from "../data/GroupMgr";
import { GameMain3D } from "../GameMain3D";

export class Util {

    public static getColumnAndRowByDirection(column:number, row:number,direction:SEARCHDIRECTION) {
        let targetRow = -1;
        let targetColumn = -1;
        let tempRow = row + GameMain3D.totalDeleteRow;
        if(tempRow % 2 == 0) {                  // 如果是双行的话...
            if(direction == SEARCHDIRECTION.UPRIGHT) {
                targetRow = row + 1;
                targetColumn = column;
            } 
            else if(direction == SEARCHDIRECTION.UPLEFT) {
                targetRow = row + 1;
                targetColumn =  column - 1;
            }
            else if(direction == SEARCHDIRECTION.LEFT) {
                targetRow = row;
                targetColumn = column - 1;
            }
            else if(direction == SEARCHDIRECTION.DOWNLEFT) {
                targetRow = row - 1;
                targetColumn = column - 1;
            } else if(direction == SEARCHDIRECTION.DOWNRIGHT) {
                targetRow = row - 1;
                targetColumn = column;
            }
            else if(direction == SEARCHDIRECTION.RIGHT) {
                targetRow = row;
                targetColumn = column + 1;
            }
        }   
        else {
            if(direction == SEARCHDIRECTION.UPRIGHT) {
                targetRow = row + 1;
                targetColumn = column+1;
            } 
            else if(direction == SEARCHDIRECTION.UPLEFT) {
                targetRow = row + 1;
                targetColumn =  column;
            }
            else if(direction == SEARCHDIRECTION.LEFT) {
                targetRow = row;
                targetColumn = column - 1;
            }
            else if(direction == SEARCHDIRECTION.DOWNLEFT) {
                targetRow = row - 1;
                targetColumn = column;
            } else if(direction == SEARCHDIRECTION.DOWNRIGHT) {
                targetRow = row - 1;
                targetColumn = column + 1;
            }
            else if(direction == SEARCHDIRECTION.RIGHT) {
                targetRow = row;
                targetColumn = column + 1;
            }
        }

        return v2(targetColumn, targetRow);
    }


    public static plainSearchBallNode(column:number,row:number, nodes:BallNode[]) {
        /** 在所有的节点中，寻找BallNode */
        let targetBallNode:BallNode = null;
        for(let i = 0; i < nodes.length; i++) {
            let ballNode = nodes[i];
            let myColumn:number = ballNode.getColumn();
            let myRow:number = ballNode.getRow();
            if(myColumn == column && myRow == row) {
                targetBallNode = ballNode;
                break;
            }
        }
        return targetBallNode;
    }

    /** 碰撞到了那个角度，那个面 */
    public static whichAngleYouHit(){

    }
}