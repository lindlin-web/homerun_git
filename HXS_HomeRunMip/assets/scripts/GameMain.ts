import { _decorator, Camera, Component, EventTouch, Input, input, instantiate, Node, Prefab, systemEvent, SystemEventType, Vec3 ,Touch, PhysicsSystem, BoxCollider, tween,screen} from 'cc';
import { BaseCode } from './BaseCode';
import { ColorCode } from './ColorCode';
import { GameManager } from './GameManager';
import { COLUMNNUM, ROWNUM } from './data/MyTableData';
import { AudioMgr } from './AudioMgr';
import { TailPage } from './TailPage';
const { ccclass, property } = _decorator;




@ccclass('GameMain')
export class GameMain extends Component {

    @property({type:Node})
    public theGuide:Node = null;

    @property({type:Node})
    public pushNode:Node = null;
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
    private startX:number = -18.9;
    private startZ:number = 7;
    private gapX:number = 1.64;
    private gapZ:number = 0.99;
    private rowNum:number = ROWNUM;
    private columnNum:number = COLUMNNUM;
    private theMinimumGap:number = 0.25;                // 检测的最小的偏差是多少...



    //export enum ChipColor {BLUE,GREEN,RED, YELLOW};

    @property({type:Prefab})
    public theEffect:Prefab;

    private groupStatus = [
        [2,1,2,1,2,4,3,2,1,0,0,-1,0,-1,0,0,3,4,3,2,1,3,1, 3,4,2,1,2],
        [4,3,4,3,4,1,2,4,3,2,3, 0,1, 0,4, 1,2,1,2,4,3,2,3, 2,1,4,3,4],
        [1,2,1,2,1,3,4,1,2,4,2, 4,3, 2,1, 3,4,3,4,1,2,4,2, 4,3,1,2,1],
        [3,4,3,4,3,2,1,3,4,1,4, 1,2, 4,3, 2,1,2,1,3,4,1,4, 1,2,3,4,3],
        [2,1,2,1,2,4,3,2,1,3,1, 3,4, 1,2, 4,3,4,3,2,1,3,1, 3,4,2,1,2],
        [4,3,4,3,4,1,2,4,3,2,3, 2,1, 3,4, 1,2,1,2,4,3,2,3, 2,1,4,3,4],
        [1,2,1,2,1,3,4,1,2,4,2, 4,3, 2,1, 3,4,3,4,1,2,4,2, 4,3,1,2,1],
        [3,4,3,4,3,2,1,3,4,1,4, 1,2, 4,3, 2,1,2,1,3,4,1,4, 1,2,3,4,3],
        [2,1,2,1,2,4,3,2,1,3,1, 3,4, 1,2, 4,3,4,3,2,1,3,1, 3,4,2,1,2],
        [4,3,4,3,4,1,2,4,3,2,3, 2,1, 3,4, 1,2,1,2,4,3,2,3, 2,1,4,3,4],
        [1,2,1,2,1,3,4,1,2,4,2, 4,3, 2,1, 3,4,3,4,1,2,4,2, 4,3,1,2,1],
        [3,4,3,4,3,2,1,3,4,1,4, 1,2, 4,3, 2,1,2,1,3,4,1,4, 1,2,3,4,3],
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

    private initPushNodePosition:Vec3 = new Vec3(-1,0,15);                     // 发牌的初始化位置.......   宽度匹配的时候的初始化位置...

    private initPushNodePositionWidth:Vec3 = new Vec3(-1,0,11)

    private pushChipsPosition:Vec3 = new Vec3(7,0,15);                         // 重新发牌的位置.........

    private pushChipsPositionWidth:Vec3 = new Vec3(7,0, 11);


    private initGuidePosition:Vec3 = new Vec3(5.6,0,15);

    private initGuidePositionWidth:Vec3 = new Vec3(5.6,0,11);

    private timeIsUp:boolean = false;           // 时间还没到.

    private isOnGuidePart:boolean = true;       // 是否还出在导航的阶段...

    private isWidthOrHeight:boolean = true;     // true  width,  false, height....

    guidePart() {
        this.pushNode.setPosition(this.initPushNodePosition);
        this.hand.setPosition(this.initPushNodePosition);

        let initGuide = this.initGuidePosition;
        if(this.isWidthOrHeight) {
            initGuide = this.initGuidePositionWidth;
            this.pushNode.setPosition(this.initPushNodePositionWidth);
            this.hand.setPosition(this.initPushNodePositionWidth);
        }

        tween(this.pushNode).delay(1.4).to(0.3, {position:initGuide}).call(()=>{
            let theChooseIndex = this.getMostCorrectPosition(this.pushNode.getWorldPosition());
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
        }).delay(0.7).call(()=>{
            this.pushTheCode();
            this.thePreChooseBase.getComponent(BaseCode).setBaseActive(false);
            this.thePreChooseBase = null;

            this.isOnGuidePart = false;
        }).start();
        tween(this.hand).delay(1.4).to(0.3,{position:initGuide}).start();
    }


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

        screen.on("window-resize", this.onWindowResize.bind(this), this);
        console.log(screen.windowSize);
        let size = screen.windowSize;
        this.onWindowResize(size.width, size.height);


        this.scheduleOnce(this.onFinished.bind(this), 30);
        this.manager = new GameManager();
        this.manager.init(this);
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
                    discNode.setPosition(this.startX + j * this.gapX , 0, this.startZ - i * this.gapZ * 2 );
                } else {
                    discNode.setPosition(this.startX + j * this.gapX, 0, this.startZ - i * this.gapZ * 2+ 0.966);
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

        this.pushNode.setPosition(this.initPushNodePosition);
        let holdChips = this.manager.createHoldChips(true);

        for(let i = 0; i < holdChips.length; i++) {
            let index = holdChips[i];
            let prefab = instantiate(this.prefabs[index]);
            let child = prefab.getChildByName("HXS_FK_1");
            prefab.getComponent(ColorCode).setColor(index);
            child.addComponent(BoxCollider);
            child.getComponent(BoxCollider).size = new Vec3(3,3,3);
            prefab.setPosition(0, 0.25 * (i + 1), 0);
            this.pushNode.getChildByName("dog").addChild(prefab);
        }

        systemEvent.on(SystemEventType.TOUCH_START, (touch:Touch) => {

            TailPage.Instance.clickDown();
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
                if(hitNode && hitNode.parent && hitNode.parent.parent && hitNode.parent.parent.parent == this.pushNode) {
                    let worldpos = this.pushNode.getWorldPosition();
                    this.isChooseOn = true;
                    this.pushNode.setWorldPosition(hitPoint.x, 0, worldpos.z);
                    this.hand.setWorldPosition(hitPoint.x, 0, worldpos.z);
                    this.attachBoxColliderForChildren(this.isChooseOn);
                }
            }
        }, this);
        
        systemEvent.on(SystemEventType.TOUCH_MOVE, (touch:Touch) =>{
            if(this.isOnGuidePart) {
                return;
            }
            let touchPos = touch.getLocation();
            let ray = this.mainCamera.screenPointToRay(touchPos.x, touchPos.y);

            if(PhysicsSystem.instance.raycastClosest(ray)) {
                const res = PhysicsSystem.instance.raycastClosestResult;
                const hitPoint = res.hitPoint;
                if(this.isChooseOn) {
                    let worldpos = this.pushNode.getWorldPosition();
                    this.pushNode.setWorldPosition(hitPoint.x, 0, worldpos.z);
                    this.hand.setWorldPosition(hitPoint.x, 0, worldpos.z);
                    let theChooseIndex = this.getMostCorrectPosition(this.pushNode.getWorldPosition());
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
            let children = this.pushNode.getChildByName("dog").children;
            if(this.thePreChooseBase && children && children.length > 0) {             // 就是先前选定的那个底座...
                this.pushTheCode();
                this.thePreChooseBase.getComponent(BaseCode).setBaseActive(false);
                this.thePreChooseBase = null;
            }
            this.shouldOpenFinishPanel();
        });

this.guidePart();


        

    }

    onWindowResize(width:number, height:number) {
        if(width > height) {
            // 宽匹配
            this.mainCamera.node.setPosition(new Vec3(0.5, 72.9,44.5));
            this.isWidthOrHeight = true;                        // 确实 宽度 匹配的
            this.pushNode.setPosition(this.initPushNodePositionWidth);

        } else {
            // 长度匹配
            this.mainCamera.node.setPosition(new Vec3(0.5, 86,55.4));
            this.isWidthOrHeight = false;                       // 确实是 长度匹配的...
            this.pushNode.setPosition(this.initPushNodePosition);
        }
    }

    /** ----------重新发牌---------- */
    public reCreateChins() {

        let initPush = this.initPushNodePosition;
        this.pushNode.setPosition(this.pushChipsPosition);
        if(this.isWidthOrHeight) {
            this.pushNode.setPosition(this.pushChipsPositionWidth);
            initPush = this.initPushNodePositionWidth;
        }
        this.theGuide.active = true;

        // 重新生成
        let holdChips = this.manager.createHoldChips(false);
        for(let i = 0; i < holdChips.length; i++) {
            let index = holdChips[i];
            let prefab = instantiate(this.prefabs[index]);
            let child = prefab.getChildByName("HXS_FK_1");
            prefab.getComponent(ColorCode).setColor(index);
            child.addComponent(BoxCollider);
            child.getComponent(BoxCollider).size = new Vec3(3,3,3);
            prefab.setPosition(0, 0.25 * (i + 1), 0);
            this.pushNode.getChildByName("dog").addChild(prefab);
        }
        tween(this.pushNode).to(0.2, {position:initPush}).start();
    }

    /** 这个代码的意思是把 碟码给推送出去... */
    public pushTheCode() {
        let children = this.pushNode.getChildByName("dog").children;
        this.theGuide.active = false;
        
        let dogWorldPosition = this.pushNode.getChildByName("dog").getWorldPosition();
        this.theTempNode.setWorldPosition(dogWorldPosition);
        let len = children.length;
        for(let i = len-1; i >= 0; i--) {
            let child = children[i];
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
                this.manager.pushHoldChips(this.tempI, this.tempJ);
                this.theCodePrefab[this.tempI][this.tempJ] = myChildren;                        // 获取到prefab...
                this.manager.setPushGroup(this.tempI, this.tempJ);
                this.reCreateChins();
            }).start();
    }

    

    public attachBoxColliderForChildren(bo) {
        bo = !bo;
        let children = this.pushNode.getChildByName("dog").children;
        for(let i = 0; i < children.length; i++) {
            let child = children[i];
            child = child.getChildByName("HXS_FK_1");
            child.addComponent(BoxCollider);
            if(bo) {
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
        let retVal = [-1,-1];       // 二位数组， 0, 横坐标, 1 s
        let longDistance = 0.0;
        for(let i = 0; i < this.baseCodeNode.length; i++) {
            let arr = this.baseCodeNode[i];
            for(let j = 0; j < arr.length; j++) {
                let baseNode = arr[j];
                let baseWorld = baseNode.getWorldPosition();
                let gap = Math.abs(baseWorld.x - testWorldPos.x);
                let theArrValue = this.manager.getChips(i, j);
                if(gap < this.theMinimumGap && theArrValue && theArrValue.length == 0) {
                    let sub = testWorldPos.clone().subtract(baseWorld);
                    let distance = sub.length();
                    if(longDistance < distance) {
                        longDistance = distance;
                        retVal[0] = i;
                        retVal[1] = j;
                    }
                }
            }
        }
        let column = retVal[1];
        let retColumn = -1;
        if(column >= 0) {
            for(let i = 0; i < this.baseCodeNode.length; i++) {
                let theArrValue = this.manager.getChips(i, column);
                if(theArrValue && theArrValue.length == 0) {
                    retColumn = i;
                }
                else if(theArrValue && theArrValue.length > 0) {
                    break;
                }
                
            }
        }
        retVal[0] = retColumn;
        return retVal;
    }

    update(deltaTime: number) {
        
    }
}


