import { Color, Vec2, Vec3 } from "cc";

export interface IGameData {

    // 分组,就是把颜色一致的球归为一堆.
    devideGroup():void;
    getInitData():number[][];
    getIsGroup(column:number, row:number);
    getGroupNum(column:number, row:number);
    createAFireNode();
    createABackNode();
    getFireValue():number;
    getBackValue():number;
    getFireColor():Color;
    getPositionByColumnAndRow(column:number, row:number,totalDeleteRow:number):Vec3;
    insertAFiringNode(column:number, row:number):void;
    getValueByColumnAndRow(column:number, row:number):number;
    howManyGoupMember(groupNum:number):number;
    needDeleteGroup(groupVal:number):void;                  // 需要被删除的组队信息是什么...
    getGroupVals():number[];                                // 获得组队信息..........
    checkTheDropThing():boolean;                                  // 看看那些会被掉落下来....
    checkToSupport():Vec2;                                  // 是否有后续可以补给到的....
    getSupport():number[][];                // 获得供给 某行 某列的值.....
    deleteTheSupportByRow(rowNum:number):void;              // 删除掉对应的行..
    changeTheCircle():void;                                 // 就是做那个转换的...备用的节点，变成正式的节点...
}


