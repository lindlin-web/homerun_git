import { Compact, CompactMovingData } from "./wig/CompactMovingData";
import { NoteData } from "./wig/NoteData";


export enum ChipColor {BLUE,GREEN,RED, YELLOW};

export enum CodeDirection {
    Up,
    LeftUp,
    LeftDown,
    Down,
    RightDown,
    RightUp
};

export const ROWNUM:number = 12;
export const COLUMNNUM:number = 20;

export const DELETECOUNT:number = 10;

export const doubleColumn:number[][] = [[1,0],[-1,0],[1,1],[1,-1],[0,1],[0,-1]];         // 1, 3, 5, 7等等的列
export const singleColumn:number[][] = [[1,0],[-1,0],[0,1],[0,-1],[-1,1],[-1,-1]];         // 0, 2, 4, 6等等的列

// 筹码的高度，在这里统一设置...
export const CodeHeight:number = 0.27;

export class MyTableData {
    
    private tableData:number[][][] = [];            // 桌面的信息


    
    private holdChips:number[] = [];                // 用来移动的那些chips。。。。 


    private noteDatas:NoteData[] = [];              // 有关笔记本的数据，放在这里....

    private compactDatas:CompactMovingData[] = [];      // 有关列的移动的数据，放置在这个地方....

    private finishedTime:Object = {};

    /** 创建一个移动的列 */
    public createMovingColumn(column:number) {
        let compactColumn = new CompactMovingData();
        compactColumn.init(column);
        this.compactDatas.push(compactColumn);
    }

    public setMovingFinish(column:number) {
        let value = this.finishedTime[column + "_"];
        if(!value) {
            this.finishedTime[column + "_"] = 0;
            
        }
        this.finishedTime[column + "_"]++;
        value = this.finishedTime[column + "_"];
        return value;
    }

    public removeColumnMovingMes(column:number) {
        this.finishedTime[column+"_"] = 0;
        for(let i = 0; i < this.compactDatas.length; i++) {
            let dd = this.compactDatas[i];
            if(dd.getColumn() == column) {
                this.compactDatas.splice(i, 1);
            }
        }
    }

    public getCompactDatasByColumn(column:number) {
        let targetColumnData:CompactMovingData = null;
        for(let i = 0; i < this.compactDatas.length; i++) {
            let theColumn = this.compactDatas[i];
            let myColumn = theColumn.getColumn();
            if(myColumn == column) {
                targetColumnData = theColumn;           // 获得这个列的数据
                break;
            }
        }
        if(!targetColumnData) {
            //console.error("==================not founded error===================");
        }
        return targetColumnData;
    }

    /** 创建一个针对列移动的数据, fromColumn,toColumn应该是一样的 */
    public createMovingColumnData(fromRow:number, fromColumn:number, toRow:number, toColumn:number) {

        let compactDatas = this.getCompactDatasByColumn(fromColumn);
        if(!compactDatas) {
            this.createMovingColumn(toColumn);
        }
        let compact = new Compact();
        compact.fromRow = fromRow;
        compact.fromColumn = fromColumn;
        compact.toRow = toRow;
        compact.toColumn = toColumn;

        let targetColumnData:CompactMovingData = null;
        for(let i = 0; i < this.compactDatas.length; i++) {
            let theColumn = this.compactDatas[i];
            let myColumn = theColumn.getColumn();
            if(myColumn == fromColumn) {
                targetColumnData = theColumn;           // 获得这个列的数据
                break;
            }
        }
        if(targetColumnData) {
            targetColumnData.pushData(compact);         // 把移动的数据，放进去...
        } else {
            console.error("===========肯定是出错了===========");
        }
    }

    public getTableData():number[][][] {
        return this.tableData;
    }
    /** 把手上持有的数据，推送到堆里面去 */
    public pushHoldChips(row:number, column:number) {
        let theArray = [];
        for(let i = 0; i < this.holdChips.length; i++) {
            let val = this.holdChips[i];
            theArray[i] = val;
        }
        this.tableData[row][column] = theArray;
        this.holdChips = [];
    }

    /** 创建一个备忘录 */
    public createNoteData(fromRow:number, fromColumn:number, toRow:number, toColumn:number, color:ChipColor, num:number) {
        let noteData = new NoteData();
        noteData.init(fromRow,fromColumn,toRow,toColumn,color,num);
        this.noteDatas.push(noteData);
    }

    /** 可以根据fromRow, fromColumn来获取备忘录 */
    public getNoteDataByFromRow_Column(fromRow:number, fromColumn:number) {
        for(let i = 0; i < this.noteDatas.length; i++) {
            let note = this.noteDatas[i];
            if(note.isEqual(fromRow, fromColumn)) {
                return note;
            }
        }
    }

    public deleteNoteDataByRow_Column(row:number, column:number) {
        for(let i = 0; i < this.noteDatas.length; i++) {
            let note = this.noteDatas[i];
            if(note.isEqual(row, column)) {
                this.noteDatas.splice(i, 1);
            }
        }
    }

    public doDeleteThing(row:number,column:number) {
        let chips = this.getChips(row, column);
        let color = chips[chips.length - 1];
        for(let i = chips.length - 1; i >= 0; i--) {
            let chipValue = chips[i];
            if(chipValue == color) {
                chips.splice(i, 1);
            }
            else {
                break;
            }
        }
    }
    /** 从背后删除相应数量的对应color的chip */
    public deleteNumColorFromTail(row:number, column:number,color:ChipColor, num:number) {
        let chips = this.getChips(row, column);
        let totalDeleteNumber = 0;
        for(let i = chips.length - 1; i >= 0; i--) {
            let chipValue = chips[i];
            if(chipValue == color) {
                chips.splice(i, 1);
                totalDeleteNumber++;
            }
        }
        if(totalDeleteNumber != num) {
            console.error("数量都不对了。肯定是什么地方出问题了");
        }
        console.log("=============做好了删除的工作了===============");
    }

    /** 查看一下对应的堆，是否可以被删除 */
    public checkCanbeDelete(row:number,column:number) {
        let chips = this.getChips(row, column);
        let tailSameNum = 0;
        let tailNum = chips[chips.length - 1];
        for(let i = chips.length - 1; i >= 0; i--) {
            if(tailNum == chips[i]) {
                tailSameNum++;
            }
        }
        let retVal = false;
        if(tailSameNum >= DELETECOUNT) {
            retVal = true;
        }
        return retVal;
    }

    public addNumColorToTail(row:number,column:number, color:ChipColor, num:number) {
        let chips = this.getChips(row, column);
        for(let i = 0; i < num; i++) {
            chips.push(color);
        }
    }

     /** 获得，筹码，从上到下，相同的数量是多少个... */
    public getTailNum(row:number, column:number):number {
        let arr = this.tableData[row][column];
        if(!arr) {
            return -1;
        }
        if(arr.length == 0) {
            return -1;
        }
        let num = 0;
        let compareNum = arr[arr.length - 1];
        for(let i = arr.length - 1; i >= 0; i--) {
            let val = arr[i];
            if(val == compareNum) {
                num ++;
            }
        }
        return num;
    }
    
    public createHoldChips(firstTouch:boolean) {
        var discCount = Math.floor(Math.random() * 6) + 5;          // 5 - 10 个之间的碟码
        let createArr = this.createRandomIndexByCount(discCount,undefined,undefined,0);
        if(firstTouch) {
            createArr = [2,2,2,2,2,2,2];
        }
        for(let i = 0; i < createArr.length; i++) {
            let val = createArr[i];
            this.holdChips[i] = val;
        }
        return createArr;       // 把创建的筹码，返回给ganmeMain.
    }

    public getChips(row:number, column:number) {
        let rows = this.tableData[row];
        if(!rows) {
            return null;
        }
        let chips = rows[column];
        return chips;
    }

    public setChips(row:number,column:number,arr:number[]) {
        let rows = this.tableData[row];
        if(!rows) {
            this.tableData[row] = [];
            rows = this.tableData[row];
        }
        let rowsColumn = rows[column];
        if(!rowsColumn) {
            this.tableData[row][column] = [];
        }
        this.tableData[row][column] = arr;
    }
    /** 初始化，一个墩子的 筹码 */
    public createChipsData(row:number, column:number,value:number) {
        var discCount = Math.floor(Math.random() * 6) + 5;          // 5 - 10 个之间的碟码
        let createArr = this.createRandomIndexByCount(discCount,row,column,value);
        let rows = this.tableData[row];
        if(!rows) {
            this.tableData[row] = [];
            rows = this.tableData[row];
        }
        let rowsColumn = rows[column];
        if(!rowsColumn) {
            this.tableData[row][column] = [];
            rowsColumn = this.tableData[row][column];
        }
        for(let i = 0; i < createArr.length; i++) {
            let val = createArr[i];
            rowsColumn[i] = val;
        }
        return createArr;       // 把创建的筹码，返回给ganmeMain.
    }

    public init() {
        this.tableData = [];
    }

    /** 比如说推动棋子的时候，需要把筹码的值给赋值到一块去 */
    public setValue(aRow:number, aColumn:number, values:number[]) {
        for(let i = 0; i < values.length; i++) {
            this.tableData[aRow][aColumn][i] = values[i];
        }
    }

    /** 把某个值，从A移动到B */
    public moveNumFromA_To_B(aRow:number, aColumn:number, bRow:number, bColumn:number, num:number) {
        let valuesA = this.tableData[aRow][aColumn];
        let count = 0;
        for(let i = valuesA.length - 1; i >= 0; i--) {
            let val = valuesA[i];
            if(val == num) {
                valuesA.splice(i,1);
                count++;            // 有多少个数量的这个数字...
            } else {
                break;
            }
        }

        let valuesB = this.tableData[bRow][bColumn];
        for(let i = 0; i < count; i++) {
            valuesB.push(num);
        }
    }



    // 靠 disCount生成碟饼
    private createRandomIndexByCount(discCount:number,row:number,column:number,value:number):number[] {
        let retVal:number[] = [];            // 返回一个都是数组的
        // 确定下来,需要一个颜色，还是需要两个颜色的碟码...
        var randomValue = Math.random() > 0.3 ? 1 : 2;                  // 是一种颜色，还是两种颜色.
        var gap = Math.floor(Math.random() * discCount) + 1;        // 1 - discount之间
        var decideColor = [];
        var randomColor = Math.floor(Math.random() * 3.99);
        decideColor.push(randomColor);
        var randomColor2 = (randomColor + 1) % 4;
        decideColor.push(randomColor2);
        for(let m = 0; m < discCount; m++) {
            if(randomValue == 1) {
                if(row>=0 && column>=0) {
                    decideColor[0] = value-1;
                }
                retVal.push(decideColor[0]);
            }
            else {
                if(m < gap && gap < discCount) {
                    retVal.push(decideColor[0]);
                } else {
                    if(row>=0 && column>=0) {
                        decideColor[1] = value-1;
                    }
                    retVal.push(decideColor[1]);
                }
            }
        }
        return retVal;
    }
}



