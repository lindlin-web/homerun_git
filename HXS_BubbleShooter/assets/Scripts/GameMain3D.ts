import { _decorator, Component, instantiate, Touch, Node, Prefab, systemEvent, SystemEventType, v3, Vec3, Camera, PhysicsSystem, Mat4, NodePool, Color, color, v2, Vec2, Vec4, v4, tween } from 'cc';
import { IGameData } from './data/IGameData';
import { BALLCOLOR, GameData, INITX, INITZ, PERX, PERZ } from './data/GameData';
import { Grid } from './AStar/Grid';
import { OpacityLind3D } from './wig/OpacityLind3D';
import { SEARCHDIRECTION } from './data/GroupMgr';
import { Util } from './util/Util';
const { ccclass, property } = _decorator;


const PERDOTLENGTH:number = 0.92;

const enum LEFTORRIGHT {
    LEFT= 0,
    RIGHT=1
}

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


    private FIREPOINT:Vec3 = v3(0, 0.1, 18);
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

    protected onLoad(): void {
        
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
        this.fireNode.setScale(v3(1.3,1.3,1.3));
        this.node.addChild(this.fireNode);
        this.fireNode.setPosition(this.FIREPOINT);
    }

    drawGrid():void {
        for(let i:number = 0; i < this._grid.getNumCols(); i++) {
            this.nodes[i] = [];
            for(let j:number = 0; j <this._grid.getNumRows(); j++) {
                let myNode = this._grid.getNode(i, j);
                let val = myNode.value;
                let pre:Prefab = this.prefabs[0]
                
                if(val == -1) {
                    continue;
                }
                let node = this.createNodeByValue(val);
                this.node.addChild(node);
                this.nodes[i][j] = node;
                let gap = 1;
                if(j % 2 == 0) {
                    gap = 0;
                } 
                let pos:Vec3 = this.getPositionByColumnAndRow(i, j);
                node.setPosition(pos);
            }
        }
    }

    getPositionByColumnAndRow(column:number, row:number):Vec3 {
        let gap = 1;
        if(row % 2 == 0) {
            gap = 0;
        } 
        let pos:Vec3 = v3(INITX +column*PERX +gap,0.1, INITZ - row * PERZ);
        return pos;
    }

    /** 获得那个最佳的碰撞的节点, 1 距离, 2 左边还是右边, 3 column  4. row */
    getTheMostHitOne(gap:Vec3):Vec4 {
        let kx = gap.x;
        let kz = gap.z;

        //  = (kz / kx) *
        //z - this.FIREPOINT.z = (kz / kx) * (x - this.FIREPOINT.x);

        // (z - this.FIREPOINT.Z) * kx = kz * (x - this.FIREPOINT.x);
        // kz * x - kx * z - kz * this.FIREPOINT.x + this.FIREPOINT.Z * kx = 0;

        let direction:number = -1;
        let A = -kz;
        let B = kx;
        let C = kz * (this.FIREPOINT.x) - this.FIREPOINT.z * kx;

        let square = Math.sqrt(A*A + B * B);
        let mostShortDistance = 40;
        let mostRealDistance = 0;       // 最近的那个的射线与圆的距离...
        let targetI = -1;
        let targetJ = -1;

        for(let i = 0; i < this.nodes.length; i++) {
            let column = this.nodes[i];
            for(let j = 0; j < column.length; j++) {
                let node = column[j];
                if(!node) {
                    continue;
                }
                let pos = node.getPosition();
                let x0 = pos.x;
                let z0 = pos.z;

                let distance = Math.abs(A * x0 + B * z0 + C );
                distance = distance / square;
                if(distance < this.radius) {
                    // 如果小于半径，说明，已经是发生了碰撞了... 这个时候还需要再计算一下最近的那个...
                    let gapX = Math.abs(this.FIREPOINT.x - x0);
                    let gapZ = Math.abs(this.FIREPOINT.z - z0);
                    let realDistance = Math.sqrt(gapX * gapX + gapZ * gapZ);
                    if(realDistance < mostShortDistance) {
                        mostShortDistance = realDistance;
                        mostRealDistance = distance;
                        targetI = i;
                        targetJ = j;
                    }
                }
            }
        }

        if(targetI >= 0 && targetJ >= 0) {
            let ggap = Math.sqrt(this.radius * this.radius - mostRealDistance * mostRealDistance);
            let dog = Math.sqrt(mostShortDistance * mostShortDistance - mostRealDistance * mostRealDistance);
            dog = dog - ggap;

            let hitPoint = v2(this.FIREPOINT.x + gap.x * dog, this.FIREPOINT.z + gap.z * dog);
            let position = this.nodes[targetI][targetJ].getPosition();
            let final = v2(hitPoint.x - position.x, hitPoint.y - position.z);
            final = final.normalize();
            let angle = Math.atan2(final.y, final.x) * 180 / Math.PI;
            if(angle <= 0) {
                angle += 360;
            }
            if(angle >= 340 && angle <= 20) {
                direction = SEARCHDIRECTION.RIGHT;
                console.log("============碰到了右边");
                console.log(v4(mostShortDistance,direction,targetI, targetJ));
            }
            else if(angle >= 20 && angle <= 90) {
                direction = SEARCHDIRECTION.DOWNRIGHT;
                console.log("==============碰到了右下");
                console.log(v4(mostShortDistance,direction,targetI, targetJ));
            }
            else if(angle >= 90 && angle <= 160) {
                direction = SEARCHDIRECTION.DOWNLEFT
                console.log("===============碰到了左下");
                console.log(v4(mostShortDistance,direction,targetI, targetJ));
            }
            else if(angle >= 160 && angle <= 180) {
                direction = SEARCHDIRECTION.LEFT;
                console.log("==================左边");
                console.log(v4(mostShortDistance,direction,targetI, targetJ));
            }
            else if(angle >= 180 && angle <= 270) {
                direction = SEARCHDIRECTION.UPLEFT;
                console.log("=================左上");
                console.log(v4(mostShortDistance,direction,targetI, targetJ));
            }
            else if(angle >= 270 && angle <= 340) {
                direction = SEARCHDIRECTION.UPRIGHT;
                console.log("=================右上");
                console.log(v4(mostShortDistance,direction,targetI, targetJ));
            }
        }
        return v4(mostShortDistance,direction,targetI, targetJ);
    }

    doTheTouchThing(touch:Touch):Vec4 {
        let touchPos = touch.getLocation();
        let ray = this.mainCamera.screenPointToRay(touchPos.x, touchPos.y);
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

            let sub = this.myGap = out.subtract(this.FIREPOINT).normalize();
            result =this.getTheMostHitOne(sub);
            let distance = result.x;
            this.createDotLine(sub, distance);
        }
        return result;
    }
    
    start() {
        systemEvent.on(SystemEventType.TOUCH_START, (touch:Touch) => {
            this.isClickOn = true;
            this.doTheTouchThing(touch);
        }, this);
        
        systemEvent.on(SystemEventType.TOUCH_MOVE, (touch:Touch) =>{
            if(this.isClickOn) {
                this.doTheTouchThing(touch);
            }
        });

        systemEvent.on(SystemEventType.TOUCH_END, (touch:Touch)=>{
            this.isClickOn = false;

            let result = this.doTheTouchThing(touch);

            
            /** 释放了之后，处理........ */
            this.handleRelease(result);

            // 回收虚线...
            this.recycleDot();
        });
    }


    /*** 释放了之后，应该做什么... */
    handleRelease(result:Vec4) {
        let isHit = result.z >= 0;
        if(isHit) {
            let hitPosition = result.y;         // 这个是被击中的 方位...
            let offsetX = result.z;
            let offsetY = result.w;
            let temp = Util.getColumnAndRowByDirection(offsetX, offsetY, hitPosition);
            console.log(temp, "===========");


        } else {
            console.log("=========没有被击中============");
            this.firingNode = this.recreateAFireNode();
            this.node.addChild(this.firingNode);
            this.firingNode.setPosition(this.FIREPOINT);
            let targetPosition:Vec3 = v3(this.FIREPOINT.x + this.myGap.x * 27, this.FIREPOINT.y, this.FIREPOINT.z + this.myGap.z * 27);
            tween(this.firingNode).to(0.2, {position:targetPosition}).call(()=>{
                this.firingNode.removeFromParent();
                this.firingNode.destroy();
                this.firingNode = null;
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
            let position = v3(this.FIREPOINT.x + plus.x, this.FIREPOINT.y + plus.y, this.FIREPOINT.z + plus.z);
            dot.setPosition(position);
        }
    }

    update(deltaTime: number) {
        
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

    /** 这个跟创建一个新节点不一样,不用改变那个值 */
    private recreateAFireNode() {
        let value = this.gameData.getFireValue();
        let node = this.createNodeByValue(value);
        return node;
    }


    private createNodeByValue(val:number) {
        let pre:Prefab = this.prefabs[0]
        if(val == 1) {
            pre = this.prefabs[0];
        } else if(val == 2) {
            pre = this.prefabs[1];
        } else if(val == 3) {
            pre = this.prefabs[2];
        }
        let node = instantiate(pre);
        return node;
    }
}


