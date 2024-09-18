import { _decorator, Component, Node, tween, Vec3 } from 'cc';
import { AppNotify, NotifyMgrCls } from './controller/AppNotify';
import { ChipColor, CodeHeight, DELETECOUNT } from './data/MyTableData';
import { ColorCode } from './ColorCode';
const { ccclass, property } = _decorator;

@ccclass('GroupCode')
export class GroupCode extends Component {
    private codes:Node[] = [];

    private row:number = 0;                 // 这个组 ，所在的行
    private column:number = 0;              // 这个组 ，所在的列

    private isPush:boolean = false;         // 是否是推送过来的那个 堆.  是推送过来的堆， 就会从别的堆 叠到 自己的 身上

    private isCheckToDelete:boolean = false;    // 这个堆，是否是可以被满10, 就删除...

    private isLock:boolean = false;       // 被锁定了.

    private listenRow:number = -1;          // 监听,某个堆的动画，是否已经完成了...
    private listenColumn:number = -1;       // 监听,某个堆的动画，是否已经完成了...

    private tempParentNode:Node = null;

    public init(codes,row, column) {
        this.codes = codes;
        this.row = row;
        this.column = column;
    }

    public isEmpty() {
        return this.codes && this.codes.length == 0;
    }

    /** 从背后删除相应数量的对应color的chip */
    public deleteNumColorFromTail(color:ChipColor, num:number) {
        let retVal:Node[] = [];
        for(let i = this.codes.length - 1; i >= 0; i--) {
            let chip = this.codes[i];
            let colorColor:ChipColor = chip.getComponent(ColorCode).getColor();
            if(colorColor == color) {
                let chipNode = this.codes.splice(i, 1)[0];
                retVal.push(chipNode);
            } else {
                break;
            }
        }
        if(retVal.length != num) {
            console.error(" 删除的数量都不相等，肯定是有问题的了");
        }
        return retVal;
    }

    public addNumColorToTail(array:Node[]) {
        for(let i = 0; i < array.length; i++) {
            let node = array[i];
            this.codes.push(node);
        }
    }

    /** ==========从尾巴节点做删除的操作========== */
    public doDeleteThing() {
        if(!this.codes) {
            console.error("=========堆不存在codes的数据,出错==========");
            return;
        }
        if(this.codes.length < DELETECOUNT) {
            console.error("=======没有达到要删除的指标，出错==============");
            return;
        }

        var over = false;
        let value:ChipColor = this.codes[this.codes.length - 1].getComponent(ColorCode).getColor();
        let total = this.codes.length - 1;
        var currentIndex = 0;
        for(var i = this.codes.length - 1; i>=0; i--) {
            let nextNode = this.codes[i-1];
            currentIndex = i;
            if(!nextNode || nextNode.getComponent(ColorCode).getColor() != value) {
                over = true;
            }
            tween(this.codes[i]).delay((total-i)*0.07).to(0.07,{scale:new Vec3(0, 0,0)}).call(this.deleteChip.bind(this,currentIndex,over)).start();
            if(over) {
                break;
            }
        }
    }

    /** 删除某一个碟片 */
    private deleteChip(index:number, isOver:boolean) {
        console.log(index, "==============这个是我要删除的index");
        let chip = this.codes[index];

        chip.removeFromParent();
        chip.destroy();
        this.codes.splice(index, 1);
        if(isOver) {
            // 发送一个事件,
            this.isCheckToDelete = false;       // 如果已经删除完毕了。就可以解锁了..
            this.isLock = false;                // 如果已经删除完毕了，就可以解锁了..
            NotifyMgrCls.getInstance().send(AppNotify.DeleteDone,this.column);
        }
    }

    public listenToFlyAnimationDone(listenRow:number, listenColumn:number) {
        this.listenRow = listenRow;
        this.listenColumn = listenColumn;
        NotifyMgrCls.getInstance().observe(AppNotify.FlyAnimationDone, this.onAnimationDone.bind(this));
    }

    public onAnimationDone(row:number, column:number) {
        if(row == this.listenRow && column == this.listenColumn) {
            NotifyMgrCls.getInstance().off(AppNotify.FlyAnimationDone, this.onAnimationDone.bind(this));        // 关闭监听...
            // 这个只是，飘动的动画已经完成了，还要确认是否可以删除...
            if(this.isCheckToDelete) {
                // 如果要被检查，是否要删除，暂时先不要解锁...
            } else {
                this.isLock = false;
            }
        }
    }

    public setCheckToDelete(bo) {
        this.isCheckToDelete = bo;
    }

    /** 获得，是否可以被删除... */
    public getChechToDelete():boolean {
        return this.isCheckToDelete;
    }

    /** 获得最后一个的节点 */
    public getTailNode():Node {
        return this.codes[this.codes.length - 1];
    }

    public getTailIndexNode(index):Node {
        // 倒数的那个节点
        return this.codes[this.codes.length - 1 - index];
    }

    /** 把孩子移动到目标地址 */
    public moveChildrenToTarget(fromPos:Vec3,targetPos:Vec3,fromRow,fromColum, toRow, toColumn) {
        this.tempParentNode = new Node();
        let theParent = this.codes[0].parent;
        theParent.addChild(this.tempParentNode);
        this.tempParentNode.setPosition(fromPos);
        for(let i = 0; i < this.codes.length; i++) {
            this.codes[i].parent = this.tempParentNode;
            this.codes[i].setPosition(new Vec3(0,(i+1)*CodeHeight,0));
        }

        tween(this.tempParentNode).to(0.18, {position:targetPos}).call(()=>{
            let parent = this.tempParentNode.parent;
            let worldPos = this.tempParentNode.getWorldPosition();
            for(let i = this.tempParentNode.children.length-1; i>=0; i--) {
                let child = this.tempParentNode.children[i];
                child.parent = parent;
                child.setWorldPosition(worldPos.x, (i+1)*CodeHeight, worldPos.z);
            }
            this.tempParentNode.destroy();
            this.tempParentNode = null;
            NotifyMgrCls.getInstance().send(AppNotify.MovingDone,fromRow,fromColum, toRow, toColumn);
        }).start();
    }

    
    /** 是否是推动过来的那个堆 */
    public setIsPush(bo:boolean) {
        this.isPush = bo;
    }

    /** 是否是推送过来的那个 */
    public getIsPush() {
        return this.isPush;
    }

    /** 判断是否是被锁定了，被锁定就不能被影响... */
    public setLock(bo:boolean) {
        this.isLock = bo;
    }

    public getGroup(){
        return this.codes;
    }

    public setGroup(codes:Node[]) {
        this.codes = codes;
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


