import { _decorator, Camera, Component, EventTouch, Input, input, instantiate, Node, Prefab, systemEvent, SystemEventType, Vec3 ,Touch, PhysicsSystem, BoxCollider, tween, Vec2, Tween} from 'cc';
import { BaseCode } from './BaseCode';
import { ColorCode } from './ColorCode';
import { GameManager } from './GameManager';
import { COLUMNNUM, ROWNUM } from './data/MyTableData';
import { AudioMgr } from './AudioMgr';
import { TailPage } from './TailPage';
import { OpacityLind3D } from './OpacityLind3D';
const { ccclass, property } = _decorator;




@ccclass('GameMain')
export class GameMain extends Component {

    @property({type:Node})
    public theGuide:Node = null;



    @property({type:Node})
    public pushNode:Node = null;

    @property({type:Node})
    public pushNode2:Node = null;

    @property({type:Node})
    public pushNode3:Node = null;
    @property({type:Prefab})
    public discCode:Prefab = null;

    @property({type:Node})
    public hand:Node = null;

    @property({type:[Prefab]})
    public prefabs:[] = [];

    @property(Camera)
    private mainCamera:Camera = null;

    @property({type:Node})
    gameMain:Node = null;
    private startX:number = -5;
    private startZ:number = 3;
    private gapX:number = 1.64;
    private gapZ:number = 0.99;
    private rowNum:number = ROWNUM;
    private columnNum:number = COLUMNNUM;
    private theMinimumGap:number = 1.85;                // 检测的最小的偏差是多少...
    private theCurrentPushNode:Node = null;             // 当前推动的那个pushNode... 


    private initPositions = [new Vec3(-5,-100,11),new Vec3(-1.6,0,11),new Vec3(1.5,-100,11)];

    //export enum ChipColor {BLUE,GREEN,RED, YELLOW};

    @property({type:Prefab})
    public theEffect:Prefab;

    private groupStatus = [
        [-1, 2, 0, 4, -1,],
        [ 1,0, 0, 0, 3,],
        [ 2, 1, 0, 5, 4,],
        [ 3, 4, 2, 1, 2,],
        [-1,-1, 3,-1,-1,]
    ];




    public theCodePrefab:Node[][][] = [];              // 持有每个prefab Node 的引用...
    private baseCodeNode:Node[][] = [];

    private isChooseOn:boolean = false;

    private thePreChooseBase:Node = null;

    private theTempNode = new Node();

    private moveSpeed = 70;                  // 这个是移动速度?????????????

    private createArr = [];                  // 创建的那个数组
    private tempI = 0;                          // 选定的那个 row
    private tempJ = 0;                          // 选定的那个column

    private manager:GameManager;         // 游戏的管理类...

    private initPushNodePosition:Vec3 = new Vec3(-1.8,0,11);                     // 发牌的初始化位置.......

    private pushChipsPosition:Vec3[] = [new Vec3(6,-100,12),new Vec3(9.2,0,12),new Vec3(12.4,-100,12)];                         // 重新发牌的位置.........

    private timeIsUp:boolean = false;           // 时间还没到.

    private isOnGuidePart:boolean = false;       // 不需要引导了......

    private totalTime:number = 0;

    private pushNodes:Node[] = [];
    // guidePart() {
    //     this.pushNode.setPosition(this.initPushNodePosition);
    //     this.hand.setPosition(this.initPushNodePosition);
    //     this.hand.active = false;           // 假定是不可见的...
    //     tween(this.pushNode).delay(1.4).to(0.3, {position:new Vec3(3,0,15)}).call(()=>{
    //         let theChooseIndex = this.getMostCorrectPosition(this.pushNode.getWorldPosition());
    //         if(theChooseIndex[0] != -1) {
    //             this.tempI = theChooseIndex[0];
    //             this.tempJ = theChooseIndex[1];
    //             let baseNode = this.baseCodeNode[this.tempI][this.tempJ];
    //             if(this.thePreChooseBase) {
    //                 this.thePreChooseBase.getComponent(BaseCode).setBaseActive(false);
    //                 this.thePreChooseBase = null;
    //             }
    //             this.thePreChooseBase = baseNode;
    //             let component = baseNode.getComponent(BaseCode);
    //             component.setBaseActive(true);
    //         } else {
    //             if(this.thePreChooseBase) {
    //                 this.thePreChooseBase.getComponent(BaseCode).setBaseActive(false);
    //                 this.thePreChooseBase = null;
    //             }
    //         }
    //     }).delay(0.7).call(()=>{
    //         this.pushTheCode();
    //         this.thePreChooseBase.getComponent(BaseCode).setBaseActive(false);
    //         this.thePreChooseBase = null;

    //         this.isOnGuidePart = false;
    //     }).start();
    //     tween(this.hand).delay(1.4).to(0.3,{position:new Vec3(3,0,15)}).start();
    // }


    onFinished() {
        this.timeIsUp = true;

        this.shouldOpenFinishPanel();
    }

    shouldOpenFinishPanel() {
        if(this.timeIsUp && !this.isChooseOn) {
            TailPage.Instance.onShowPage();
        }
    }
    start() {
        this.pushNode.active = false;
        this.pushNode3.active = false;
        this.pushNodes = [this.pushNode, this.pushNode2, this.pushNode3];

        this.scheduleOnce(this.onFinished.bind(this), 91);
        this.manager = new GameManager();
        this.manager.init(this);

        this.hand.active = true;           // 假定是不可见的...
        this.theGuide.active = false;       // 假定引导是不可见的...
        this.theTempNode.setParent(this.gameMain);
        this.baseCodeNode = [];
        this.theCodePrefab = [];
        for(let i = 0; i < this.rowNum; i++) {
            this.baseCodeNode[i] = [];
            this.theCodePrefab[i] = [];
            for(let j = 0; j < this.columnNum; j++) {
                this.theCodePrefab[i][j] = [];
                let discNode = instantiate(this.discCode);
                this.baseCodeNode[i][j] = discNode;
                if(j % 2 == 0) {
                    discNode.setPosition(this.startX + j * this.gapX , 0, this.startZ - i * this.gapZ * 2 + 0.966);
                } else {
                    discNode.setPosition(this.startX + j * this.gapX, 0, this.startZ - i * this.gapZ * 2);
                }
                this.gameMain.addChild(discNode);           // 添加了底盘...
                let nosee = this.groupStatus[i][j] == -1;
                if(nosee) {
                    discNode.active = false;
                    this.manager.setChips(i, j,[]);
                    continue;
                }
                let firstVisible = this.groupStatus[i][j] == 0 ? true: false;       // 头部有一定的概率不要叠.... 
                if(firstVisible) {
                    this.manager.setChips(i, j,[]);
                    continue;
                }

                let createArr = this.manager.createChips(i, j,this.groupStatus[i][j]);

                for(let z = 0; z < createArr.length; z++) {
                    let index = createArr[z];
                    let prefab = this.prefabs[index];
                    if(!prefab) {
                        console.log("=========================xxx");
                    }
                    let pref = instantiate(this.prefabs[index]);
                    this.theCodePrefab[i][j][z] = pref;                 // 获取筹码的引用指针...
                    pref.getComponent(ColorCode).setColor(index);
                    let temp = new Vec3();
                    discNode.getPosition(temp);
                    pref.setPosition(temp.x, temp.y + 0.25 * (z + 1), temp.z);
                    this.gameMain.addChild(pref);
                }
            }
        }

        this.manager.createGroups();            // 创建那个堆...
        for(let i = 0; i < 3; i++) {
            this.pushNodes[i].setPosition(this.initPositions[i]);
        }
        
        let holdChips = this.manager.createHoldChips();

        for(let i = 0; i < holdChips.length; i++) {
            let holdChip = holdChips[i];
            for(let j = 0; j < holdChip.length; j++) {
                let index = holdChip[j];
                let prefab = instantiate(this.prefabs[index]);
                let child = prefab.getChildByName("HXS_FK_1");
                prefab.getComponent(ColorCode).setColor(index);
                child.addComponent(BoxCollider);
                child.getComponent(BoxCollider).size = new Vec3(3,3,3);
                prefab.setPosition(0, 0.25 * (j + 1), 0);
                this.pushNodes[i].getChildByName("dog").addChild(prefab);
            }
        }
        
        systemEvent.on(SystemEventType.TOUCH_START, (touch:Touch) => {
            this.hand.active = false;
            //TailPage.Instance.clickDown();
            AudioMgr.Instance.PlayBgm();
            if(this.isOnGuidePart) {
                return;
            }
            let touchPos = touch.getLocation();
            let ray = this.mainCamera.screenPointToRay(touchPos.x, touchPos.y);
            if(PhysicsSystem.instance.raycastClosest(ray)) {
                const res = PhysicsSystem.instance.raycastClosestResult;
                const hitNode = res.collider.node;
                const hitPoint = res.hitPoint;
                for(let i = 0; i < this.pushNodes.length; i++) {
                    this.theCurrentPushNode = this.pushNodes[i];
                    if(hitNode && hitNode.parent && hitNode.parent.parent && hitNode.parent.parent.parent == this.theCurrentPushNode) {
                        this.isChooseOn = true;
                        this.theCurrentPushNode.setWorldPosition(hitPoint.x, 3, hitPoint.z - 1);
                        this.attachBoxColliderForChildren(this.isChooseOn);
                        let children = this.theCurrentPushNode.getChildByName("dog").children;
                        for(let i = 0; i < children.length; i++) {
                            let child = children[i];
                            child = child.getChildByName("HXS_FK_1");
                        }
                        break;
                    }
                }
            }
        }, this);
        
        systemEvent.on(SystemEventType.TOUCH_MOVE, (touch:Touch) =>{
            
            let touchPos = touch.getLocation();
            let ray = this.mainCamera.screenPointToRay(touchPos.x, touchPos.y);

            if(PhysicsSystem.instance.raycastClosest(ray)) {
                const res = PhysicsSystem.instance.raycastClosestResult;
                const hitPoint = res.hitPoint;
                if(this.isChooseOn) {
                    let worldpos = this.theCurrentPushNode.getWorldPosition();
                    this.theCurrentPushNode.setWorldPosition(hitPoint.x, 3, hitPoint.z-1);
                    let theChooseIndex = this.getMostCorrectPosition(this.theCurrentPushNode.getWorldPosition());
                    if(theChooseIndex[0] != -1) {
                        this.tempI = theChooseIndex[0];
                        this.tempJ = theChooseIndex[1];
                        let baseNode = this.baseCodeNode[this.tempI][this.tempJ];
                        if(this.thePreChooseBase) {
                            this.thePreChooseBase.getComponent(BaseCode).setBaseActive(false);
                            this.thePreChooseBase = null;
                        }
                        this.thePreChooseBase = baseNode;
                        let component = baseNode.getComponent(BaseCode);
                        component.setBaseActive(true);
                    } else {
                        if(this.thePreChooseBase) {
                            this.thePreChooseBase.getComponent(BaseCode).setBaseActive(false);
                            this.thePreChooseBase = null;
                        }
                    }
                }
            }
        });

        systemEvent.on(SystemEventType.TOUCH_END, (touch:Touch)=>{
            if(this.isOnGuidePart) {
                return;
            }
            AudioMgr.Instance.pos.play();
            if(this.isChooseOn) {
                this.isChooseOn = false;
                this.attachBoxColliderForChildren(this.isChooseOn);    
            }
            if(this.theCurrentPushNode) {
                let children = this.theCurrentPushNode.getChildByName("dog").children;
                if(this.thePreChooseBase && children && children.length > 0) {             // 就是先前选定的那个底座...
                    this.pushTheCode();
                    this.thePreChooseBase.getComponent(BaseCode).setBaseActive(false);
                    this.thePreChooseBase = null;
                }
            }

            let index = 0;
            for(let i = 0; i < this.pushNodes.length; i++) {
                let push = this.pushNodes[i];
                if(push == this.theCurrentPushNode) {
                    index = i;
                    break;
                }
            }
            if(this.theCurrentPushNode) {
                this.theCurrentPushNode.setPosition(this.initPositions[index]);
            }

            this.shouldOpenFinishPanel();
        });

//this.guidePart();
    }

    /** ----------重新发牌---------- */
    public reCreateChins() {

        for(let i = 0; i < 3; i++) {
            this.pushNodes[i].setPosition(this.initPositions[i]);
        }

        
        let holdChips = this.manager.createHoldChips();
        console.log(holdChips, "=============holdChips");
        for(let i = 0; i < holdChips.length; i++) {
            let holdChip = holdChips[i];
            for(let j = 0; j < holdChip.length; j++) {
                let index = holdChip[j];
                let prefab = instantiate(this.prefabs[index]);
                let child = prefab.getChildByName("HXS_FK_1");
                prefab.getComponent(ColorCode).setColor(index);
                child.addComponent(BoxCollider);
                child.getComponent(BoxCollider).size = new Vec3(3,3,3);
                prefab.setPosition(0, 0.25 * (j + 1), 0);
                this.pushNodes[i].getChildByName("dog").addChild(prefab);
            }
            let pushNode = this.pushNodes[i];
            let temp:Vec3 = this.initPositions[1];
            temp = new Vec3(temp.x, temp.y, temp.z);
            pushNode.setPosition(temp);
            if(pushNode.active == true) {
                var children = pushNode.getChildByName("dog").children;
                for(let m = 0; m < children.length; m++) {
                    let child = children[m];
                    let opt = child.getComponent(OpacityLind3D);
                    Tween.stopAllByTarget(opt);
                    opt.Alpha = 0;
                    var t4 = tween(opt);
                    t4.delay(0.1);
                    t4.to(0.3, {Alpha: 255});
                    t4.start();
                }
                //tween(pushNode).to(0.4, {position:this.initPositions[1]}).start();
            }
            //tween(this.pushNodes[i]).to(0.2 +i *0.2, {position:this.initPositions[i]}).start();
        }
        
    }

    /** 这个代码的意思是把 碟码给推送出去... */
    public pushTheCode() {
        let children = this.theCurrentPushNode.getChildByName("dog").children;
        this.theGuide.active = false;
        
        let dogWorldPosition = this.theCurrentPushNode.getChildByName("dog").getWorldPosition();
        this.theTempNode.setWorldPosition(dogWorldPosition);
        let len = children.length;
        for(let i = len-1; i >= 0; i--) {
            let child = children[i];
            child.getChildByName("HXS_FK_1").removeComponent(BoxCollider);
            child.setParent(this.theTempNode);
        }

        let targetPos = this.thePreChooseBase.getWorldPosition();
        let time =Math.abs(targetPos.z - dogWorldPosition.z) / this.moveSpeed;
        tween(this.theTempNode)
            .to(time,{worldPosition:targetPos}).call(()=>{
                let children = this.theTempNode.children;
                let len = children.length;
                let myChildren:Node[] = [];
                for(let i = len - 1; i >= 0; i--) {
                    let child = children[i];
                    let pos = child.getWorldPosition();
                    child.setParent(this.gameMain);
                    child.setWorldPosition(pos);
                    myChildren.push(child);
                }
                let decideIndex = 0;
                for(let i = 0; i < this.pushNodes.length; i++) {
                    let pN = this.pushNodes[i];
                    if(pN == this.theCurrentPushNode) {
                        decideIndex = i;
                        break;
                    }
                }
                this.manager.pushHoldChips(this.tempI, this.tempJ,decideIndex);
                this.theCodePrefab[this.tempI][this.tempJ] = myChildren;                        // 获取到prefab...
                this.manager.setPushGroup(this.tempI, this.tempJ);
                this.theCurrentPushNode = null;

                let isEmpty = this.manager.isHoldChipsEmpty();
                if(isEmpty) {
                    this.reCreateChins();
                }
            }).start();
    }


    /** ======================确认是否已经满了====================== */
    public checkIsFull() {
        let isFull = true;
        for(let i = 0; i < this.rowNum; i++) {
            let rowNodes = this.baseCodeNode[i];
            for(let j = 0; j < this.columnNum; j++) {
                let rowColumn = rowNodes[j];
                if(rowColumn.active) {
                    let group = this.manager.getGroup(i, j);
                    let lock = group.getLock();
                    if(lock) {
                        isFull = false;
                    }
                    if(group.isEmpty()) {
                        isFull = false;
                    }
                }
            }
        }
        console.log(isFull);
        return isFull;
    }

    

    public attachBoxColliderForChildren(bo) {
        bo = !bo;
        let children = this.theCurrentPushNode.getChildByName("dog").children;
        for(let i = 0; i < children.length; i++) {
            let child = children[i];
            child = child.getChildByName("HXS_FK_1");
            if(bo) {
                child.addComponent(BoxCollider);
                child.getComponent(BoxCollider).size = new Vec3(3,3,3);
            } else {
                child.removeComponent(BoxCollider);
            }
        }
    }

    public getBaseCodePosition(row:number, column:number) {
        let pos:Vec3 = this.baseCodeNode[row][column].getPosition();
        return pos;
    }

    public getMostCorrectPosition(testWorldPos:Vec3) {
        testWorldPos.y = 0.25;
        let retVal = [-1,-1];       // 二位数组， 0, 横坐标, 1 s
        let longDistance = 22.0;
        let wp1 = new Vec2(testWorldPos.x, testWorldPos.z);
        for(let i = 0; i < this.baseCodeNode.length; i++) {
            let arr = this.baseCodeNode[i];
            for(let j = 0; j < arr.length; j++) {
                let baseNode = arr[j];
                let baseWorld = baseNode.getWorldPosition();
                let theArrValue = this.manager.getChips(i, j);
                if(baseNode.active && theArrValue && theArrValue.length == 0) {
                    let gap = wp1.clone().subtract(new Vec2(baseWorld.x, baseWorld.z)).length();
                
                    if(gap < this.theMinimumGap && theArrValue && theArrValue.length == 0) {
                        let sub = testWorldPos.clone().subtract(baseWorld);
                        let distance = sub.length();
                        if(longDistance > distance) {
                            longDistance = distance;
                            retVal[0] = i;
                            retVal[1] = j;
                        }
                    }
                }
                
            }
        }
        return retVal;
    }

    update(deltaTime: number) {
        this.totalTime += deltaTime;
        if(this.totalTime > 0.5) {
            let bo = this.checkIsFull();
            this.totalTime -= 0.5;
            if(bo) {
                TailPage.Instance.onShowPage();
            }
        }
    }
}


