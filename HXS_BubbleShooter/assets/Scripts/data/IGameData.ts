import { Color } from "cc";

export interface IGameData {

    // 分组,就是把颜色一致的球归为一堆.
    devideGroup():void;
    getInitData():number[][];
    getIsGroup(column:number, row:number);
    getGroupNum(column:number, row:number);
    createAFireNode();
    createABackNode();
    getFireValue():number;
    getFireColor():Color
}


