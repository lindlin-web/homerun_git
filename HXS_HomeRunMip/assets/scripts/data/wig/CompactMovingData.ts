export class Compact {
    public fromRow:number = -1;
    public fromColumn:number = -1;
    public toRow:number = -1;
    public toColumn:number = -1;
}

export class CompactMovingData{

    private column:number = -1;
    private datas:Compact[] = [];

    public init(column) {
        this.column = column;
    }
    /** 获得列的数据 */
    public getColumn() {
        return this.column;
    }

    public getIndexData(index) {
        return this.datas[index];
    }
    public pushData(data:Compact) {
        this.datas.push(data);
    }

    public myDataLength() {
        return this.datas.length;
    }

    public myCompactData() {
        return this.datas;
    }
}


