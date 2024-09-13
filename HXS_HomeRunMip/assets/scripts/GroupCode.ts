import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GroupCode')
export class GroupCode extends Component {
    private codes:Node[] = [];
    private values:number[] = [];

    private row:number = 0;                 // 这个组 ，所在的行
    private column:number = 0;              // 这个组 ，所在的列

    private isPush:boolean = false;         // 是否是推送过来的那个 堆.  是推送过来的堆， 就会从别的堆 叠到 自己的 身上

    private isCanEffect:boolean = false;    // 是否是可影响的堆，如果可以影响，那么周边的堆，就会被判断如果有同一个颜色，就会被叠起来....

    private isLock:boolean = false;       // 被锁定了.

    public init(codes,values, row, column) {
        this.codes = codes;
        this.values = values;
        this.row = row;
        this.column = column;
    }

    /** 获得最后一个的节点 */
    public getTailNode():Node {
        return this.codes[this.codes.length - 1];
    }

    public getTailIndexNode(index):Node {
        // 倒数的那个节点
        return this.codes[this.codes.length - 1 - index];
    }

    /** 获得，筹码，从上到下，相同的数量是多少个... */
    public getTailNum():number {
        if(!this.values) {
            return 0;
        }
        if(this.values.length < 1) {
            return 0;
        }
        let tail = this.values[this.values.length - 1];
        let retVal= 0;
        for(let i = this.values.length - 1; i >= 0; i--) {
            let val = this.values[i];
            if(tail == val) {
                retVal ++;
            } else {
                break;
            }
        }
        return retVal;
    }

    public getValues():number[] {
        return this.values;
    }

    /** 是否是推动过来的那个堆 */
    public setIsPush(bo:boolean) {
        this.isPush = bo;
    }

    /** 是否是推送过来的那个 */
    public getIsPush() {
        return this.isPush;
    }

    /** 是否可以被影响到 */
    public setIsCanEffect(bo:boolean) {
        this.isCanEffect = bo;
    }

    /** 判断是否是被锁定了，被锁定就不能被影响... */
    public setLock(bo:boolean) {
        this.isLock = bo;
    }

    // 获得这个堆的行信息
    public getRow():number {
        return this.row;
    }
    // 获得这个堆的列信息...
    public getColumn():number {
        return this.column;
    }

    /** 是否是被锁定的了，如果这个堆处在被转移的状态的时候，是不可以再次被处理的 */
    public getLock():boolean {
        return this.isLock;
    }

}


