import { Color, Vec3 } from "cc";

export interface IGameData {

    // 分组,就是把颜色一致的球归为一堆.
    devideGroup():void;
    getInitData():number[][];
    getIsGroup(column:number, row:number);
    getGroupNum(column:number, row:number);
    createAFireNode();
    createABackNode();
    getFireValue():number;
    getFireColor():Color;
    getPositionByColumnAndRow(column:number, row:number):Vec3;
    insertAFiringNode(column:number, row:number):void;
    getValueByColumnAndRow(column:number, row:number):number;
    howManyGoupMember(groupNum:number):number;
    needDeleteGroup(groupVal:number):void;                  // 需要被删除的组队信息是什么...
    getGroupVals():number[];                                // 获得组队信息..........
    checkTheDropThing():void;                                  // 看看那些会被掉落下来....
    printLog():void;
    checkToSupport():void;                                  // 是否有后续可以补给到的....
}


