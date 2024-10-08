export class MyNode {
    public value:number;        // 这个MyNode的值
    public x:number;
    public y:number;
    public f:number;
    public g:number;
    public h:number;
    public walkable:boolean = true;
    public parent:MyNode;

    public constructor(x:number, y:number,value:number) {
        this.x = x;
        this.y = y;
        this.value = value;
        if(this.value < 0) {
            this.walkable = false;
        }
        /** 为寻路添加一个特殊的判断 */
        if(this.value == -2) {
            this.walkable = true;
        }
    }
}