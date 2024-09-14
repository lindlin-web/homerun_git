import { ChipColor } from "../MyTableData";

/** 这个类好像是一个笔记本，记录，那个墩子 移动到那个墩子，移动了什么数据.... */
export class NoteData{
    
    public fromRow:number = -1;                        // 从那个行移动过来的....
    public fromColum:number = -1;                      // 从那个列移动过来的.

    public toRow:number = -1;                          // 移动到那个行
    public toColumn:number = -1;                       // 移动到那个列
    public color:ChipColor = ChipColor.BLUE;           // 移动了什么颜色.
    public num:number = -1;                // 移动了多少个

    public init(fromRow:number, fromColum:number, toRow:number, toColumn:number, color:ChipColor, num:number) {
        this.fromRow = fromRow;
        this.fromColum = fromColum;
        this.toRow = toRow;
        this.toColumn = toColumn;
        this.color = color;
        this.num = num;
    }

    /*** 基本上，只要判断，fromRow,fromColumn是否相等，就可以了 */
    public isEqual(fromRow:number, fromColumn:number) {
        let retVal = false;
        retVal = this.fromRow == fromRow && this.fromColum == fromColumn;
        return retVal;
    }
}


