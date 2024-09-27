import { BALLCOLOR } from "./GameData";
import { SEARCHDIRECTION } from "./GroupMgr";

export class BallNode {
    private row:number = 0;
    private column:number = 0;
    private color:BALLCOLOR = -1;

    private group:number = -1;              // 是否属于某一个组队... -1是不属于任何组...

    private searchDirection:SEARCHDIRECTION = SEARCHDIRECTION.UPRIGHT;
    public init(_c:number, _r:number,color:BALLCOLOR) {
        this.column = _c;
        this.row = _r;
        this.color = color;
    }


    /** 设置搜寻方向 */
    public setSearchDirection(sd:SEARCHDIRECTION) {
        this.searchDirection = sd;
    }

    /** 获得搜寻方向 */
    public getSearchDirection() {
        return this.searchDirection;
    }
    /** 设置组队信息 */
    public setGroup(group:number) {
        this.group = group;
    }

    /** 获得组队信息 */
    public getGroup() {
        return this.group;
    }

    /** 是否已经组队了 */
    public isInGroup() {
        return this.group != -1;
    }

    /** 克隆这个ball的信息 */
    public clone() {
        let bb = new BallNode();
        bb.setRow(this.getRow());
        bb.setColumn(this.getColumn());
        bb.setColor(this.getColor());
        return bb;
    }

    public getRow() {
        return this.row;
    }

    public setRow(_r:number) {
        this.row = _r;
    }
    public getColumn() {
        return this.column;
    }

    public setColumn(_c:number) {
        this.column = _c;
    }

    public getColor() {
        return this.color;
    }

    public setColor(_c:BALLCOLOR) {
        this.color = _c;
    }
}