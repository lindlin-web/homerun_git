import { _decorator, Component, instantiate, Touch, Node, Prefab, systemEvent, SystemEventType, v3, Vec3, Camera, PhysicsSystem, Mat4, NodePool, Color, color, v2, Vec2, Vec4, v4, tween,screen, setPropertyEnumType, utils, DebugMode, Widget, Label, UITransform, size, director } from 'cc';
import { IGameData } from './data/IGameData';
import { BALLCOLOR, GameData, INITX, INITZ, PERX, PERZ } from './data/GameData';
import { Grid } from './AStar/Grid';
import { OpacityLind3D } from './wig/OpacityLind3D';
import { SEARCHDIRECTION } from './data/GroupMgr';
import { Util } from './util/Util';
import { AppNotify, NotifyMgrCls } from './controller/AppNotify';
import { GameMain } from './GameMain';
import { DropingNode } from './wig/DropingNode';
import { OperateNode } from './wig/OperateNode';
import { TailPage } from './TailPage';
import { AudioMgr } from './AudioMgr';
import Debug from './Debug';
const { ccclass, property } = _decorator;


const PERDOTLENGTH:number = 0.92;

const enum LEFTORRIGHT {
    LEFT= 0,
    RIGHT=1
}

let SPEED:number = 60;            // 速度..

const OBJCOLOR = {
    "BLUE":color(0,82,255,100),
    "PINK": color(255,0,255,100),
    "YELLOW":color(233,178,0,100)
}
@ccclass('GameMain3D')
export class GameMain3D extends Component {

    private _grid:Grid;
    @property({type:[Prefab]})
    prefabs:Prefab[] = [];

    private gameData:IGameData = null;

    private nodes:Node[][] = [];


    private isClickOn:boolean = false;          // 是否是在点击的状态中.

    @property(Camera)
    private mainCamera:Camera = null;           // 镜头信息...


    private convertFirePoint:Vec3 = v3(0, 0.1, 18);

    private convertFirePoint1:Vec3 = v3(0, 0.1, 19);

    private convertFirePoint2:Vec3 = v3(0, 0.1, 12);

    @property(Prefab)
    dotNode:Prefab = null;          // 就是那个点虚线的预制体...

    private dotNodePool:NodePool = null;            // 虚线的对象池...

    private usedDotNodes:Node[] = [];               // 使用中的虚线...

    private radius:number = 1.05;                   // 这个是 叠片的半径...

    /** 准备发射的节点 */
    @property(Node)
    fireNode:Node = null;

    /*** 预备要发射的节点 */
    @property(Node)
    backupNode:Node = null;


    private myGap:Vec3 = v3(0, 0,0);     
    
    private firingNode:Node = null;

    @property(Node)
    mask:Node = null;

    @property(Label)
    pointValue:Label = null;

    @property(Node)
    theLogo:Node;

    @property(GameMain)
    theGameMain:GameMain;

    @property(Node)
    operator:Node;

    public static totalDeleteRow:number = 0;          // 总共删除了多少行..

    private theFakeNodes:Node[] = [];               // 尾巴的 用来显示用的几个节点。...


    private canShoot:boolean = true;               // 可以射击...

    @property(Node)
    theHand:Node;

    private isOnGuide:boolean = true;           // 是否是在引导的阶段...

    private initPosition:Vec3 = v3(3.633, 1.367,15.182);


    private needDeleteNum:number = 0;


    /* 做进度条的东西========begin */
    private currentPoint:number = 0;
    private totalPoint:number = 500;

    private totalProgress = 257;

    /* 做进度条的东西========end */
    private perPoint:number = 0;

    @property(Node)
    head:Node = null;

    @property(Node)
    button:Node;

    @property(Node)
    circle:Node;

    @property(Node)
    icon:Node;

    protected onLoad(): void {

        this.perPoint = this.totalProgress / this.totalPoint;               //
        this.scheduleOnce(()=>{
            this.showFinalPage();
        },30);
        Debug.initial(DebugMode.VERBOSE);
        Debug.log("hello world");
        NotifyMgrCls.getInstance().observe(AppNotify.INSERTBUBBLEDONE, this.onInsertBubbleDone.bind(this));
        NotifyMgrCls.getInstance().observe(AppNotify.DELETEBUBBLEDONE, this.onDeleteBubbleDone.bind(this));
        NotifyMgrCls.getInstance().observe(AppNotify.DROPBUBBLEDONE, this.onDropBubbleDone.bind(this));
        this.dotNodePool = new NodePool();

        this.gameData = new GameData();
        let initData = this.gameData.getInitData();
        let columns = initData.length;
        let rows = 0;
        for(let i = 0; i < columns; i++) {
            let length = initData[i].length;
            if(length > rows) {
                rows = length;
            }
        }
        this._grid = new Grid(columns, rows,initData);
        // this._grid.setStartNode(0, 1);
        // this._grid.setEndNode(0, 8);

        this.drawGrid();

        this.fireNode = this.createAFireNode();
        this.fireNode.name = "FireBoy";
        this.fireNode.setScale(v3(1.3,1.3,1.3));
        this.backupNode = this.createABackNode();
        this.operator.addChild(this.fireNode);
        this.operator.addChild(this.backupNode);
        this.fireNode.setPosition(this.operator.getComponent(OperateNode).firePosition);
        this.backupNode.setPosition(this.operator.getComponent(OperateNode).backPosition);

        
        this.operator.getComponent(OperateNode).setFireNode(this.fireNode);
        this.operator.getComponent(OperateNode).setBackNode(this.backupNode);

        screen.on("window-resize", this.onWindowResize.bind(this), this);
        let size = screen.windowSize;
        this.onWindowResize(size.width, size.height);

        

    }


// Vec2 {x: 16, y: 2}
// Vec2 {x: 17, y: 2}
// Vec2 {x: 18, y: 2}
// Vec2 {x: 16, y: 3}
// Vec2 {x: 16, y: 4}
// Vec2 {x: 17, y: 3}
// Vec2 {x: 18, y: 4}
    doTheProgress(points:number) {
        this.currentPoint += points;
        if(this.currentPoint >= this.totalPoint) {
            this.currentPoint = this.totalPoint;
            this.scheduleOnce(()=>{
                TailPage.Instance.onShowPage();
            }, 1.0);
            
        }
        this.pointValue.string = this.currentPoint + "/" + this.totalPoint;
        let height = this.mask.getComponent(UITransform).contentSize.height;
        this.mask.getComponent(UITransform).setContentSize(this.perPoint*this.currentPoint, height);
    }

    onDropBubbleDone(vecs:Vec2[]) {
        
        this.doTheProgress(vecs.length);
        this.printLog(true);
        for(let i = 0; i < vecs.length; i++) {
            let vec = vecs[i];
            let node = this.nodes[vec.x][vec.y];
            this.nodes[vec.x][vec.y] = null;

            if(!node) {
                return;
            }
            node.getComponent(DropingNode).doDroping();
            tween(node).delay(1).call(()=>{
                node.removeAllChildren();
                node.removeFromParent();
                node.destroy();
                node = null;
            }).start();
            for(let j = 0; j < node.children.length; j++) {
                let dropNode = node.children[j].getComponent(DropingNode);
                if(dropNode) {
                    dropNode.doDroping();
                }
            }
        }
        this.printLog(true);
        this.scheduleOnce(()=>{
            this.checkCanBeSupported();
        }, 1);
    }

    checkCanBeSupported() {

        // 基本上，删除的行， 和 补给的行是一样的..
        let deleteAndSupport:Vec2 = this.gameData.checkToSupport();     // 看看是否还有可以补给..

        console.log("===================how many support ====", deleteAndSupport.y);
        console.log("====================before front support");
        this.printLog(true);
        // 这个地方，还必须把this.nodes里面对应的数据给清空一下...
        for(let i = 0; i < deleteAndSupport.y; i++) {
            
            for(let j = 0; j < this.nodes.length; j++) {
                let nodes = this.nodes[j];
                nodes.shift();
            }
        }
        console.log("====================after front support");
        this.printLog(true);

        GameMain3D.totalDeleteRow += deleteAndSupport.y;

        this.doTheSupport(deleteAndSupport.y);                // 添加供给进去....
    }

    /** 把供给填充进去 */
    doTheSupport(support:number) {
        let SUPPORTDATA = this.gameData.getSupport();
        for(let i = 0; i < support; i++) {
            for(let j = 0; j < SUPPORTDATA.length; j++) {
                let val = SUPPORTDATA[j][i];
                if(val == -1) {
                    this.nodes[j][this.nodes[j].length] = null;
                    continue;
                }
                let node = this.createNodeByValue(val);
                this.node.addChild(node);
                this.nodes[j].push(node);
                let pos:Vec3 = this.gameData.getPositionByColumnAndRow(j,this.nodes[j].length - 1, GameMain3D.totalDeleteRow);
                node.setPosition(pos);
                let num = Math.ceil(Math.random() * 4);
                for(let k = 0; k < num; k++) {
                    let temp = this.createNodeByValue(val);
                    temp.setRotationFromEuler(v3(0,60,0));
                    node.addChild(temp);
                    temp.setPosition(0, pos.y + 0.25 * k,-0.01 * k);
                }
            }
        }

        

        this.gameData.deleteTheSupportByRow(support);           // 供给上，删除对应的行...

        if(support > 0) {
            this.doTheMoving(support);
        } else {
            this.checkIsEqual();
            this.canShoot = true;
            this.printLog(false);
        }
    }

    /** 然后做一下移动 */
    doTheMoving(rowNum:number) {

        let SUPPORTDATA = this.gameData.getSupport();
        for(let i = this.theFakeNodes.length - 1; i >= 0; i--) {
            let node = this.theFakeNodes[i];
            node.removeFromParent();
        }
        this.theFakeNodes = [];
        for(let i = 0; i < SUPPORTDATA.length; i++) {
            let val = SUPPORTDATA[i][0];
            if(val !=undefined && val != -1) {
                let node = this.createNodeByValue(val);
                if(val == -2) {
                    node.active = false;
                }
                this.node.addChild(node);
                this.theFakeNodes.push(node);
                let pos:Vec3 = this.gameData.getPositionByColumnAndRow(i,this.nodes[0].length, GameMain3D.totalDeleteRow);
                node.setPosition(pos);
            }
        }
        let original = this.node.getPosition();
        let pos = v3(original.x,original.y,original.z + PERZ * rowNum);

        tween(this.node).to(0.1, {position:v3(original.x,original.y,original.z-0.2)}).to(0.1,{
            position:v3(pos.x,pos.y,pos.z+0.2)
        }).to(0.2, {position:pos}).call(()=>{
            this.node.setPosition(pos);

            let matrix = this.node.getWorldMatrix();
            let tempMat4 = new Mat4();
            Mat4.invert(tempMat4, matrix);
            let tempPos:Vec3 = v3(0,0,0);
            this.operator.getChildByName("FireBoy").getWorldPosition(tempPos);
            Vec3.transformMat4(this.convertFirePoint, tempPos, tempMat4);
            this.checkIsEqual();
            this.canShoot = true;
            this.printLog(false);
        }).start();
    }

    deleteDoneCanContinue() {
        this.needDeleteNum--;
        let retVal = false;
        if(this.needDeleteNum <= 0) {
            this.printLog(true);

            this.checkIsEqual();
    
            let bo:boolean = this.checkDrop();      // true 是没有掉落，可以继续， false是有掉落，不能前进.
            if(bo) {
                this.canShoot = true;
                this.checkCanBeSupported();
            }
        }
    }

    onDeleteBubbleDone(vecs:Vec2[]) {
        this.doTheProgress(vecs.length);
        AudioMgr.Instance.pile.play();
        this.needDeleteNum = vecs.length;
        this.printLog(true);
        for(let i = 0; i < vecs.length; i++) {
            let vec = vecs[i];
            let node = this.nodes[vec.x][vec.y];
            if(!node) {
                console.log("==========肯定是有错误的");
                return;
            }
            let length = node.children.length;
            for(let j = length - 1; j >= 0; j--) {
                let child = node.children[j];
                tween(child).delay((length-j)*0.07).to(0.07,{scale:new Vec3(0, 0,0)}).call(()=>{
                    AudioMgr.Instance.pile2.play();
                    child.removeFromParent();
                    child.destroy();
                    console.log(j, "================j 等于什么");
                    if(j == 0) {
                        node.removeFromParent();
                        node.destroy();
                        node = null;
                        this.nodes[vec.x][vec.y] = null;
                        this.deleteDoneCanContinue();
                    }
                }).start();
            }
        }
    }

    showFinalPage() {
        TailPage.Instance.onShowPage();
    }

    /*** 数据通知，已经在列 行中插入了一个bubble了 */
    onInsertBubbleDone(column:number, row:number):void {
        if(row < 0) {
            this.showFinalPage();
            return;
        }
        let val = this.gameData.getValueByColumnAndRow(column,row);
        let node = this.createNodeByValue(val);
        this.node.addChild(node);
        this.printLog(true);
        this.nodes[column][row] = node;
        this.printLog(true);
        let pos:Vec3 = this.gameData.getPositionByColumnAndRow(column, row,GameMain3D.totalDeleteRow);
        node.setPosition(pos);
        let bo = this.checkGrid(column, row);
        //this.theGameMain.reDraw();

        /** 就是把备用的，变成正式的节点 */
        this.changeCircle();
        if(bo) {
            this.scheduleOnce(()=>{
                this.canShoot = true;
            },0.2);
        }

    }

    changeCircle() {
        this.gameData.changeTheCircle();                // 备用的变成正式的， 然后 产生一个备用的.
        let temp = this.fireNode;
        this.fireNode = this.backupNode;
        this.backupNode = temp;
        this.backupNode.removeFromParent();
        this.backupNode.destroy();
        this.backupNode = null;

        this.backupNode = this.doBackNode();
        this.operator.addChild(this.backupNode);
        this.backupNode.setPosition(this.operator.getComponent(OperateNode).firePosition);
        this.backupNode.setScale(v3(1.3,1.3,1.3));

        this.operator.getComponent(OperateNode).setFireNode(this.fireNode);
        this.operator.getComponent(OperateNode).setBackNode(this.backupNode);
        this.operator.getComponent(OperateNode).doCircleThing();
    }

    /** 需要做的掉落有那些的 */
    checkDrop() {
        return this.gameData.checkTheDropThing();         // 判断那些会被掉落下来...
    }

    checkGrid(column:number, row:number){
        this.gameData.devideGroup();
        let groupVal = this.gameData.getGroupNum(column, row);
        let numOfGroup = this.gameData.howManyGoupMember(groupVal);
        let retVal:boolean = true;
        if(numOfGroup > 1) {
            retVal = false;
            this.gameData.needDeleteGroup(groupVal);
        }
        return retVal;
    }

    drawGrid():void {
        for(let i:number = 0; i < this._grid.getNumCols(); i++) {
            this.nodes[i] = [];
            for(let j:number = 0; j <this._grid.getNumRows(); j++) {
                let myNode = this._grid.getNode(i, j);
                let val = myNode.value;
                let pre:Prefab = this.prefabs[0]
                if(val == -1) {
                    this.nodes[i][j] = null;
                    continue;
                }
                let node = this.createNodeByValue(val);
                
                this.node.addChild(node);
                this.nodes[i][j] = node;
                let pos:Vec3 = this.gameData.getPositionByColumnAndRow(i, j,GameMain3D.totalDeleteRow);
                node.setPosition(pos);
                let num = Math.ceil(Math.random() * 4);
                for(let k = 0; k < num; k++) {
                    let temp = this.createNodeByValue(val);
                    temp.setRotationFromEuler(v3(0,60,0));
                    node.addChild(temp);
                    temp.setPosition(0, pos.y + 0.25 * k,-0.1 * k);
                }
            }
        }

        for(let i :number = 0; i < this._grid.getNumCols(); i++) {
            let val:number = this.gameData.getSupport()[i][0];
            let pre:Prefab = this.prefabs[0];
            if(val == -1) {
                continue;
            }
            let node = this.createNodeByValue(val);
            this.node.addChild(node);
            let pos:Vec3 = this.gameData.getPositionByColumnAndRow(i,this._grid.getNumRows(), GameMain3D.totalDeleteRow);
            node.setPosition(pos);
            this.theFakeNodes.push(node);
        }
    }

    /** 获得那个最佳的碰撞的节点, 1 距离, 2 左边还是右边, 3 column  4. row */
    getTheMostHitOne(gap:Vec3):Vec4 {
        let kx = gap.x;
        let kz = gap.z;
        let direction:number = -1;
        let A = -kz;
        let B = kx;
        let C = kz * (this.convertFirePoint.x) - this.convertFirePoint.z * kx;
        let square = Math.sqrt(A*A + B * B);
        let mostShortDistance = 120;
        let mostRealDistance = 0;       // 最近的那个的射线与圆的距离...
        let targetI = -1;
        let targetJ = -1;

        for(let i = 0; i < this.nodes.length; i++) {
            let column = this.nodes[i];
            for(let j = 0; j < column.length; j++) {
                let node = column[j];
                if(!node || !node.isValid) {
                    continue;
                }
                if(!node) {
                    console.log("===========how come=================");
                }
                let pos = node.getPosition();
                let x0 = pos.x;
                let z0 = pos.z;

                let distance = Math.abs(A * x0 + B * z0 + C );
                distance = distance / square;
                if(distance < (this.radius*1.50)) {
                    // 如果小于半径，说明，已经是发生了碰撞了... 这个时候还需要再计算一下最近的那个...
                    let gapX = Math.abs(this.convertFirePoint.x - x0);
                    let gapZ = Math.abs(this.convertFirePoint.z - z0);
                    let realDistance = Math.sqrt(gapX * gapX + gapZ * gapZ);
                    if(realDistance < mostShortDistance) {
                        direction = this.whichAngleYouHit(gap,i,j,distance,realDistance);
                        if(direction < 0) {
                        }
                        let temp:Vec2 = Util.getColumnAndRowByDirection(i, j, direction);
                        let occupied:boolean = this.gameData.getValueByColumnAndRow(temp.x, temp.y) != -1;

                        if(occupied) {
                            direction = this.secondCheck(direction,i, j, v2(gap.x,gap.z));
                            temp = Util.getColumnAndRowByDirection(i,j,direction);
                            occupied =  this.gameData.getValueByColumnAndRow(temp.x, temp.y) != -1;
                            if(occupied) {
                                continue;
                            }
                        }
                        mostShortDistance = realDistance;
                        mostRealDistance = distance;
                        targetI = i;
                        targetJ = j;
                    }
                }
            }
        }

        if(targetI >= 0 && targetJ >= 0) {
            direction = this.whichAngleYouHit(gap,targetI,targetJ,mostRealDistance, mostShortDistance);
            let temp:Vec2 = Util.getColumnAndRowByDirection(targetI, targetJ, direction);
            let occupied:boolean = this.gameData.getValueByColumnAndRow(temp.x, temp.y) != -1;

            if(occupied) {
                direction = this.secondCheck(direction,targetI, targetJ, v2(gap.x,gap.z));
                temp = Util.getColumnAndRowByDirection(targetI,targetJ,direction);
                occupied =  this.gameData.getValueByColumnAndRow(temp.x, temp.y) != -1;
            }
        }
        return v4(mostShortDistance,direction,targetI, targetJ);
    }

    doTheTouchThing2(posx:number, posy:number):Vec4 {
        let ray = this.mainCamera.screenPointToRay(posx, posy);
        let result = v4(0, 0, 0, 0);
        if(PhysicsSystem.instance.raycastClosest(ray)) {
            const res = PhysicsSystem.instance.raycastClosestResult;
            let hitPoint = res.hitPoint;
            hitPoint.y = 0.1;
            const out = new Vec3();
            const tempMat4 = new Mat4();
            const nodeAWorldMat4 = this.node.getWorldMatrix();          // 获得我的 空间矩阵.
            Mat4.invert(tempMat4, nodeAWorldMat4);
            Vec3.transformMat4(out, hitPoint, tempMat4);

            // out 就是点击的位置，已经转换为我的本地坐标了。。。。。

            let sub = this.myGap = out.subtract(this.convertFirePoint).normalize();
            result = this.doTheTouchThing3(sub);
        }
        return result;
    }

    doTheTouchThing3(sub:Vec3) {
        let result = v4(0, 0, 0, 0);
        result =this.getTheMostHitOne(sub);
        let distance = result.x;
        this.createDotLine(sub, distance);
        return result;
    }

    doTheTouchThing(touch:Touch):Vec4 {
        let touchPos = touch.getLocation();
        let result = this.doTheTouchThing2(touchPos.x, touchPos.y);
        return result;
    }

    onWindowResize(width:number, height:number) {
        let dogWidth = width;
        if(width > height) {
            this.mainCamera.fov = 45;
            this.node.setPosition(v3(0, 0, 0));
            this.operator.setPosition(v3(0, 0,0));
            SPEED = 60;
            this.button.scale = v3(0.40,0.40,0.40);
            this.button.getComponent(Widget).bottom = 30;
            this.button.getComponent(Widget).horizontalCenter= 146;

            this.theLogo.scale = v3(0.45,0.45,0.45);
            this.theLogo.getComponent(Widget).bottom = 20;
            this.theLogo.getComponent(Widget).horizontalCenter= -160;

            this.mask.parent.scale = v3(0.85,0.85,0.85);
            let _y = this.mask.parent.getPosition().y;

            let scaleVal = height / 720;
            let final = -width / 2  /scaleVal;
            this.mask.parent.setPosition(v3(final + 40, _y, 0));
            this.head.active = false;

            this.circle.scale = v3(1.0, 1.0,1.0);
            this.convertFirePoint = this.convertFirePoint1.clone();

            this.operator.getComponent(OperateNode).setWidthOrHeight(1);
        } else {
            this.mainCamera.fov = 80;
            this.node.setPosition(v3(0, 0, -1.9));
            this.operator.setPosition(v3(0,0,7.8));
            SPEED = 160;
            this.button.scale = v3(0.25,0.25,0.25);
            this.theLogo.scale = v3(0.32,0.32,0.32);
            this.button.getComponent(Widget).bottom = 35;
            this.button.getComponent(Widget).horizontalCenter= 60;

            this.theLogo.getComponent(Widget).bottom = 35;
            this.theLogo.getComponent(Widget).horizontalCenter= -80;
            this.mask.parent.scale = v3(0.5,0.5,0.5);
            let _y = this.mask.parent.getPosition().y;

            let width = this.mask.parent.getComponent(UITransform).contentSize.width;
            width = width * this.mask.parent.getScale().x;
            this.mask.parent.setPosition(v3(-width/2, _y, 0));
            this.head.active = true;
            this.circle.scale = v3(1.5, 1.5,1.5);
            this.convertFirePoint = this.convertFirePoint2.clone();
            this.operator.getComponent(OperateNode).setWidthOrHeight(2);

            let sss = height / 720;
            let myWidth = dogWidth / sss;
            this.icon.setPosition(v3(-myWidth / 2, 0, 0));

        }
        let original:Vec3 = v3(0, 0, 0);
        this.node.getPosition(original);
        this.node.setPosition(v3(original.x,original.y,original.z + PERZ * GameMain3D.totalDeleteRow));

        let matrix = this.node.getWorldMatrix();
        let tempMat4 = new Mat4();
        Mat4.invert(tempMat4, matrix);
        let tempPos:Vec3 = v3(0,0,0);
        this.operator.getChildByName("FireBoy").getWorldPosition(tempPos);
        Vec3.transformMat4(this.convertFirePoint, tempPos, tempMat4);

        console.log(this.convertFirePoint, "====================this.convertFirePoint");

    }
    
    
    start() {
        systemEvent.on(SystemEventType.TOUCH_START, (touch:Touch) => {
            AudioMgr.Instance.PlayBgm();
            TailPage.Instance.clickDown();
            if(!this.canShoot) {
                return;
            }
            this.isClickOn = true;
            this.doTheTouchThing(touch);
        }, this);
        
        systemEvent.on(SystemEventType.TOUCH_MOVE, (touch:Touch) =>{
            if(!this.canShoot) {
                return;
            }
            if(this.isClickOn) {
                let result = this.doTheTouchThing(touch);
                if(result.z >= 0) {
                    console.log(result, "======result是什么");
                }
            }
        });

        systemEvent.on(SystemEventType.TOUCH_END, (touch:Touch)=>{
            if(!this.canShoot) {
                return;
            }
            if(!this.isClickOn) {
                return;
            }
            this.canShoot = false;
            this.isClickOn = false;

            let result = this.doTheTouchThing(touch);

            AudioMgr.Instance.pos.play();
            /** 释放了之后，处理........ */
            this.handleRelease(result);

            // 回收虚线...
            this.recycleDot();
        });

        this.doTheGuideThing();
        
    }

    doTheGuideThing() {
        this.canShoot = false;
        let target = 0.653;
        let size = screen.windowSize;
        if(size.height > size.width) {
            target = 0.353;
        }
        tween(this.theHand).to(0.5,{position:v3(0.253,1.367,13.182)}).to(0.7, {position:v3(-1.233,1.367,13.182)}).to(0.6, {position:v3(target,1.367,13.182)}).delay(0.5).call(()=>{
            this.canShoot = true;
            this.isOnGuide = false;
            this.theHand.active = false;

            let matrix = this.node.getWorldMatrix();
            let tempMat4 = new Mat4();
            Mat4.invert(tempMat4, matrix);
            let tempPos:Vec3 = v3(0,0,0);
            this.operator.getChildByName("FireBoy").getWorldPosition(tempPos);
            Vec3.transformMat4(this.convertFirePoint, tempPos, tempMat4);


            let tempPos2:Vec3 = v3(0, 0, 0);
            this.operator.getChildByName("theHand").getWorldPosition(tempPos2);
            Vec3.transformMat4(tempPos2, tempPos2,tempMat4);

            

            let sub = this.myGap = tempPos2.subtract(this.convertFirePoint).normalize();
            sub = sub.normalize();
            sub.y = 0;

            console.log(sub, "========sub是等于多少");
            let result = this.doTheTouchThing3(sub);
            /** 释放了之后，处理........ */
            this.handleRelease(result);
            // 回收虚线...
            this.recycleDot();

        }).start();

    }

    printLog(bo:boolean) {
        if(bo) {
            let str:string = "";
            for(let i = 0; i < this.nodes.length; i++) {
                for(let j = 0; j < this.nodes[i].length; j++) {
                    let node = this.nodes[i][j];
                    if(node) {
                        str += " " + 1 + ",";
                    } else {
                        str += "" + (-1) + ",";
                    }
                }
                str += "\n";
            }
        } else {
            let str:string = "";
            for(let i = 0; i < this.nodes.length; i++) {
                for(let j = 0; j < this.nodes[i].length; j++) {
                    let node = this.nodes[i][j];
                    if(node) {
                        str += " " + 1 + ",";
                    } else {
                        str += "" + (-1) + ",";
                    }
                }
                str += "\n";
            }
        }
    }


    /*** 释放了之后，应该做什么... */
    handleRelease(result:Vec4) {
        let isHit = result.z >= 0;
        if(isHit) {
            let hitPosition = result.y;         // 这个是被击中的 方位...
            let offsetX = result.z;
            let offsetY = result.w;
            let temp = Util.getColumnAndRowByDirection(offsetX, offsetY, hitPosition);
            if(temp.x < 0) {
                console.log("========hello world");
            }
            this.firingNode = this.recreateAFireNode();
            this.firingNode.name = "FireBoy";
            this.node.addChild(this.firingNode);
            this.firingNode.setPosition(this.convertFirePoint);

            let targetPosition:Vec3 = this.gameData.getPositionByColumnAndRow(temp.x, temp.y,GameMain3D.totalDeleteRow);

            let distance:number = Vec3.distance(targetPosition, this.convertFirePoint);
            let time = distance / SPEED;
            tween(this.firingNode).to(time, {position:targetPosition}).call(()=>{
                this.gameData.insertAFiringNode(temp.x, temp.y);
                this.firingNode.removeFromParent();
                this.firingNode.destroy();
                this.firingNode = null;
            }).start();
        } else {
            this.firingNode = this.recreateAFireNode();
            this.firingNode.name = "FireBoy";
            this.node.addChild(this.firingNode);
            this.firingNode.setPosition(this.convertFirePoint);
            let targetPosition:Vec3 = v3(this.convertFirePoint.x + this.myGap.x * 40, this.convertFirePoint.y, this.convertFirePoint.z + this.myGap.z * 40);
            tween(this.firingNode).to(0.2, {position:targetPosition}).call(()=>{
                this.firingNode.removeFromParent();
                this.firingNode.destroy();
                this.firingNode = null;
                this.canShoot = true;
                /** 就是把备用的，变成正式的节点 */
                this.changeCircle();
                this.printLog(false);
            }).start();
        }
    }

    recycleDot() {
        let len = this.usedDotNodes.length - 1;
        for(let i = len; i >= 0; i--) {
            let node = this.usedDotNodes[i];
            this.usedDotNodes.pop();
            this.dotNodePool.put(node);
        }
    }
    /** gap 单位化向量,  needNumber 需要的数据 */
    createDotLine(gap:Vec3, needNumber:number) {
        needNumber = Math.ceil((needNumber - this.radius)/PERDOTLENGTH);
        let usedLength = this.usedDotNodes.length - needNumber;
        // 说明需要增加数量
        if(usedLength < 0) {
            for(let i = 0; i < Math.abs(usedLength); i++) {
                let dot = this.getDotNode();
                this.node.addChild(dot);
                this.usedDotNodes.push(dot);
            }
        }
        else if(usedLength > 0) {
            let len = this.usedDotNodes.length - 1;
            for(let i = len; i > len - usedLength; i--) {
                let node = this.usedDotNodes[i];
                this.usedDotNodes.pop();
                this.dotNodePool.put(node);
            }
        }
        for(let i = 0; i < needNumber; i++) {
            let dot = this.usedDotNodes[i];
            dot.getComponent(OpacityLind3D).MyColor = this.gameData.getFireColor();
            let plus = v3(gap.x * i * PERDOTLENGTH, 0, gap.z * i * PERDOTLENGTH);
            let position = v3(this.convertFirePoint.x + plus.x, this.convertFirePoint.y + plus.y, this.convertFirePoint.z + plus.z);
            dot.setPosition(position);
        }
    }

    update(deltaTime: number) {
        if(this.isOnGuide) {
            let matrix = this.node.getWorldMatrix();
            let tempMat4 = new Mat4();
            Mat4.invert(tempMat4, matrix);
            let tempPos:Vec3 = v3(0,0,0);
            this.operator.getChildByName("FireBoy").getWorldPosition(tempPos);
            Vec3.transformMat4(this.convertFirePoint, tempPos, tempMat4);


            let tempPos2:Vec3 = v3(0, 0, 0);
            this.operator.getChildByName("theHand").getWorldPosition(tempPos2);
            Vec3.transformMat4(tempPos2, tempPos2,tempMat4);

            

            let sub = this.myGap = tempPos2.subtract(this.convertFirePoint).normalize();
            sub = sub.normalize();
            sub.y = 0;

            this.doTheTouchThing3(sub);
        }
    }
    private getDotNode():Node {
        const size = this.dotNodePool.size();
        if(size <= 0) {
            // 克隆节点
            const dotNode = instantiate(this.dotNode);
            this.dotNodePool.put(dotNode);
        }
        // 从对象池中获取节点
        return this.dotNodePool.get();
    }

    private createAFireNode() {
        let value = this.gameData.createAFireNode();
        let node = this.createNodeByValue(value);
        return node;
    }

    private createABackNode() {
        let value = this.gameData.createABackNode();
        let node = this.createNodeByValue(value);
        return node;
    }

    private doBackNode() {
        let value = this.gameData.getBackValue();
        let node = this.createNodeByValue(value);
        return node;
    }

    /** 这个跟创建一个新节点不一样,不用改变那个值 */
    private recreateAFireNode() {
        let value = this.gameData.getFireValue();
        let node = this.createNodeByValue(value);
        return node;
    }


    private createNodeByValue(val:number) {
        let pre:Prefab = this.prefabs[0]
        if(val == -1) {
            pre = this.prefabs[3];
        }
        else if(val == -2) {
            pre = this.prefabs[3];
        }
        else if(val == 1) {
            pre = this.prefabs[0];
        } else if(val == 2) {
            pre = this.prefabs[1];
        } else if(val == 3) {
            pre = this.prefabs[2];
        }
        let node = instantiate(pre);
        if(val == -2) {
            node.active = false;
        }
        return node;
    }


    private whichAngleYouHit(gap:Vec3,targetI:number, targetJ:number, mostRealDistance:number, mostShortDistance:number) {
        if(mostRealDistance <= this.radius) {
            let direction = -1;
            let ggap = Math.sqrt(this.radius * this.radius - mostRealDistance * mostRealDistance);
            let dog = Math.sqrt(mostShortDistance * mostShortDistance - mostRealDistance * mostRealDistance);
            dog = dog - ggap;
    
            let hitPoint = v2(this.convertFirePoint.x + gap.x * dog, this.convertFirePoint.z + gap.z * dog);
            let position = this.nodes[targetI][targetJ].getPosition();
            let final = v2(hitPoint.x - position.x, hitPoint.y - position.z);
            final = final.normalize();
            let angle = Math.atan2(final.y, final.x) * 180 / Math.PI;
            if(angle <= 0) {
                angle += 360;
            }
            if(angle >= 300 || angle <= 40) {
                direction = SEARCHDIRECTION.RIGHT;
            }
            else if(angle >= 20 && angle <= 90) {
                direction = SEARCHDIRECTION.DOWNRIGHT;
            }
            else if(angle >= 90 && angle <= 160) {
                direction = SEARCHDIRECTION.DOWNLEFT
            }
            else if(angle >= 160 && angle <= 180) {
                direction = SEARCHDIRECTION.LEFT;
            }
            else if(angle >= 180 && angle <= 270) {
                direction = SEARCHDIRECTION.UPLEFT;
            }
            else if(angle >= 270 && angle <= 300) {
                direction = SEARCHDIRECTION.UPRIGHT;
            }
            return direction;
        } else {
            let direction = -1;
            let ggap = Math.sqrt(mostShortDistance * mostShortDistance - mostRealDistance * mostRealDistance);
            let dog = ggap;
            let hitPoint = v2(this.convertFirePoint.x + gap.x * dog, this.convertFirePoint.z + gap.z * dog);
            let position = this.nodes[targetI][targetJ].getPosition();
            let final = v2(hitPoint.x - position.x, hitPoint.y - position.z);
            final = final.normalize();
            let angle = Math.atan2(final.y, final.x) * 180 / Math.PI;
            if(angle <= 0) {
                angle += 360;
            }
            if(angle >= 300 || angle <= 40) {
                direction = SEARCHDIRECTION.RIGHT;
            }
            else if(angle >= 20 && angle <= 90) {
                direction = SEARCHDIRECTION.DOWNRIGHT;
            }
            else if(angle >= 90 && angle <= 160) {
                direction = SEARCHDIRECTION.DOWNLEFT
            }
            else if(angle >= 160 && angle <= 180) {
                direction = SEARCHDIRECTION.LEFT;
            }
            else if(angle >= 180 && angle <= 270) {
                direction = SEARCHDIRECTION.UPLEFT;
            }
            else if(angle >= 270 && angle <= 300) {
                direction = SEARCHDIRECTION.UPRIGHT;
            }
            return direction;
        }
        
    }


    secondCheck(direction:SEARCHDIRECTION,column:number, row:number,speed:Vec2) {

        if(direction == SEARCHDIRECTION.RIGHT) {
            direction = SEARCHDIRECTION.DOWNRIGHT;
            let temp:Vec2 = Util.getColumnAndRowByDirection(column, row, direction);
            let occupied:boolean = this.gameData.getValueByColumnAndRow(temp.x, temp.y) != -1;
            if(occupied) {
                direction = SEARCHDIRECTION.UPRIGHT;
                temp = Util.getColumnAndRowByDirection(column, row, direction);
                occupied = this.gameData.getValueByColumnAndRow(temp.x, temp.y) != -1;
            }
        }
        else if(direction == SEARCHDIRECTION.LEFT) {
            direction = SEARCHDIRECTION.DOWNLEFT;
            let temp:Vec2 = Util.getColumnAndRowByDirection(column, row, direction);
            let occupied:boolean = this.gameData.getValueByColumnAndRow(temp.x, temp.y) != -1;
            if(occupied) {
                direction = SEARCHDIRECTION.UPLEFT;
                temp = Util.getColumnAndRowByDirection(column, row, direction);
                occupied = this.gameData.getValueByColumnAndRow(temp.x, temp.y) != -1;
            }
        }
        else if(direction == SEARCHDIRECTION.DOWNLEFT) {
            if(speed.x > 0) {
                direction = SEARCHDIRECTION.LEFT;
                let temp:Vec2 = Util.getColumnAndRowByDirection(column, row, direction);
                let occupied:boolean = this.gameData.getValueByColumnAndRow(temp.x, temp.y) != -1;
                if(occupied) {
                    direction = SEARCHDIRECTION.DOWNRIGHT;
                    temp = Util.getColumnAndRowByDirection(column, row, direction);
                    occupied = this.gameData.getValueByColumnAndRow(temp.x, temp.y) != -1;
                }
            }
            else {
                direction = SEARCHDIRECTION.DOWNRIGHT;
                let temp:Vec2 = Util.getColumnAndRowByDirection(column, row, direction);
                let occupied:boolean = this.gameData.getValueByColumnAndRow(temp.x, temp.y) != -1;
                if(occupied) {
                    direction = SEARCHDIRECTION.DOWNRIGHT;
                    temp = Util.getColumnAndRowByDirection(column, row, direction);
                    occupied = this.gameData.getValueByColumnAndRow(temp.x, temp.y) != -1;
                }
            }
        }
        else if(direction == SEARCHDIRECTION.DOWNRIGHT) {
            if(speed.x > 0) {
                direction = SEARCHDIRECTION.DOWNLEFT;
                let temp:Vec2 = Util.getColumnAndRowByDirection(column, row, direction);
                let occupied:boolean = this.gameData.getValueByColumnAndRow(temp.x, temp.y) != -1;
                if(occupied) {
                    direction = SEARCHDIRECTION.DOWNLEFT;
                    temp = Util.getColumnAndRowByDirection(column, row, direction);
                    occupied = this.gameData.getValueByColumnAndRow(temp.x, temp.y) != -1;
                }
            }
            else {
                direction = SEARCHDIRECTION.RIGHT;
                let temp:Vec2 = Util.getColumnAndRowByDirection(column, row, direction);
                let occupied:boolean = this.gameData.getValueByColumnAndRow(temp.x, temp.y) != -1;
                if(occupied) {
                    direction = SEARCHDIRECTION.DOWNLEFT;
                    temp = Util.getColumnAndRowByDirection(column, row, direction);
                    occupied = this.gameData.getValueByColumnAndRow(temp.x, temp.y) != -1;
                }
            }
        }
        return direction;
    }

    /** 用来检测，数据，还有前端，是否是一致的 */
    checkIsEqual() {

        let isEqual:boolean = true;
        let nodes = this.nodes;
        let datas = this.gameData.getInitData();
        for(let i = 0; i < nodes.length; i++) {
            for(let j = 0; j < nodes[i].length; j++) {
                let node = nodes[i][j];
                if(node){
                    let val = datas[i][j];
                    if(val == -1) {
                        isEqual = false;
                    }
                } else {
                    let val = datas[i][j];
                    if(val >= 0) {
                        isEqual = false;
                    }
                }
            }
        }

        for(let i = 0; i < datas.length; i++) {
            for(let j = 0; j < datas[i].length; j++) {
                let val = datas[i][j];
                if(val >= 0) {
                    let node = nodes[i][j];
                    if(!node) {
                        isEqual = false;
                    }
                } else {
                    let node = nodes[i][j];
                    if(node && val != -2) {
                        isEqual = false;
                    }
                }
            }
        }
        if(!isEqual) {
            console.log("不一样")
        }
        else {
            console.log("是一样");
        }
        if(isEqual) {
            let isAllOver = true;
            for(let i = 0; i < datas.length; i++) {
                for(let j = 0; j < datas[i].length; j++) {
                    let val = datas[i][j];
                    if(val >= 0) {
                        isAllOver = false;
                    }
                }
            }

            if(isAllOver) {
                this.button.active = false;
                TailPage.Instance.onShowPage();
            }
        }
    }
}


