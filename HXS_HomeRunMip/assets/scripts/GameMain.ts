import { _decorator, Camera, Component, EventTouch, Input, input, instantiate, Node, Prefab, systemEvent, SystemEventType, Vec3 ,Touch, PhysicsSystem, BoxCollider, tween} from 'cc';
import { BaseCode } from './BaseCode';
import { ColorCode } from './ColorCode';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;




@ccclass('GameMain')
export class GameMain extends Component {

    @property({type:Node})
    public theGuide:Node = null;

    @property({type:Node})
    public pushNode:Node = null;
    @property({type:Prefab})
    public discCode:Prefab = null;

    @property({type:[Prefab]})
    public prefabs:[] = [];

    @property(Camera)
    private mainCamera:Camera = null;

    @property({type:Node})
    gameMain:Node = null;
    private startX:number = -8;
    private startZ:number = 3;
    private gapX:number = 1.7;
    private gapZ:number = 1.0;
    private rowNum:number = 10;
    private columnNum:number = 10;
    private theMinimumGap:number = 0.15;                // 检测的最小的偏差是多少...



    public theCodePrefab:Node[][][] = [];              // 持有每个prefab Node 的引用...
    private baseCodeNode:Node[][] = [];

    private isChooseOn:boolean = false;

    private thePreChooseBase:Node = null;

    private theTempNode = new Node();

    private moveSpeed = 20;                  // 这个是移动速度?????????????

    private createArr = [];                  // 创建的那个数组
    private tempI = 0;                          // 选定的那个 row
    private tempJ = 0;                          // 选定的那个column

    private manager:GameManager = null;         // 游戏的管理类...

    private pushNodeInitWorldPosition:Vec3 = new Vec3(0, 0, 0);         // 推的位置的初始化位置....

    @property({type:Node})
    testNode:Node;
    start() {
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
                    discNode.setPosition(this.startX + j * this.gapX , 0, this.startZ - i * this.gapZ * 2 + 1);
                } else {
                    discNode.setPosition(this.startX + j * this.gapX, 0, this.startZ - i * this.gapZ * 2);
                }
                this.gameMain.addChild(discNode);           // 添加了底盘...

                let firstVisible = Math.random() > 0.9 ? true: false;       // 头部有一定的概率不要叠.... 
                if(!firstVisible && i == 0) {
                    this.manager.setChips(i, j,[]);
                    continue;
                }
                if(i == 1) {
                    let arr = this.manager.getChips(i-1,j);
                    if(arr && arr.length == 0) {
                        let secondVisible = Math.random() > 0.3? true: false;       // 头部有一定的概率不要叠.... 
                        if(!secondVisible) {
                            this.manager.setChips(i, j,[]);
                            continue;
                        }
                    }
                }

                let createArr = this.manager.createChips(i, j);
                for(let z = 0; z < createArr.length; z++) {
                    let index = createArr[z];
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


        let holdChips = this.manager.createHoldChips();
        for(let i = 0; i < holdChips.length; i++) {
            let index = holdChips[i];
            let prefab = instantiate(this.prefabs[index]);
            let child = prefab.getChildByName("HXS_FK_1");
            prefab.getComponent(ColorCode).setColor(index);
            child.addComponent(BoxCollider);
            prefab.setPosition(0, 0.25 * (i + 1), 0);
            this.pushNode.getChildByName("dog").addChild(prefab);
        }

        systemEvent.on(SystemEventType.TOUCH_START, (touch:Touch) => {

            let touchPos = touch.getLocation();
            let ray = this.mainCamera.screenPointToRay(touchPos.x, touchPos.y);

            if(PhysicsSystem.instance.raycastClosest(ray)) {
                const res = PhysicsSystem.instance.raycastClosestResult;
                const hitNode = res.collider.node;
                if(hitNode && hitNode.parent && hitNode.parent.parent && hitNode.parent.parent.parent == this.pushNode) {
                    this.isChooseOn = true;
                    this.attachBoxColliderForChildren(this.isChooseOn);
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
                    let worldpos = this.pushNode.getWorldPosition();
                    this.pushNode.setWorldPosition(hitPoint.x, 0, worldpos.z);
                    let theChooseIndex = this.getMostCorrectPosition(this.pushNode.getWorldPosition());
                    if(theChooseIndex[0] != -1) {
                        this.tempI = theChooseIndex[0];
                        this.tempJ = theChooseIndex[1];
                        let baseNode = this.baseCodeNode[this.tempI][this.tempJ];
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
            if(this.isChooseOn) {
                this.isChooseOn = false;
                this.attachBoxColliderForChildren(this.isChooseOn);    
            }
            if(this.thePreChooseBase) {
                this.pushTheCode();
                this.thePreChooseBase.getComponent(BaseCode).setBaseActive(false);
                this.thePreChooseBase = null;
            }
        });
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
        console.log("================我看看这个地方，会执行多少次==================1111111111");
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
                console.log("================我看看这个地方，会执行多少次==================2222222");
                this.manager.setPushGroup(this.tempI, this.tempJ);
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
                child.addComponent(BoxCollider);
            } else {
                child.removeComponent(BoxCollider);
            }
        }
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
        return retVal;
    }

    update(deltaTime: number) {
        
    }

    testButton() {
        /** 测试 A->B两个组的合并 */
        // let groupA = this.manager.getGroup(3, 3);
        // let groupB = this.manager.getGroup(2, 3);
        // this.manager.moveFrom1to2(groupA, groupB);

        /** 测试 筹码的转动 */
        //this.testNode.getComponent(ColorCode).startRotate(CodeDirection.Down);
    }
}


