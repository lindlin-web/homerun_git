import { _decorator, Component, misc, Node, Quat, quat, tween, Vec3 } from 'cc';
import { CodeDirection } from './GameMain';
const { ccclass, property } = _decorator;

@ccclass('ColorCode')
export class ColorCode extends Component {

    @property({type:Node})
    model:Node = null;
    private targetNum = 180;        // 转动的最终的角度
    private rotateSpeed = 140;             // 每一帧转动的角度
    private startAnim:boolean = false;      // 是否可以开始转动...

    private rotateDir:CodeDirection;
    private currentRotateAngle:number = 0;      // 当前已经转动了多少了.
    private rotateAxis:Vec3;

    private moveTarget:Vec3 = null;             // 移动的目标地址...
    private moveSpeed = 10;                      // 移动的速度是多少...
    private spendTime = 0;                      // 花费的时间是多少...
    start() {

    }

    startRotate(dir:CodeDirection) {
        this.rotateDir = dir;
        this.startAnim = true;
        this.currentRotateAngle = 0;
        let rad = misc.degreesToRadians(30);
        if(dir == CodeDirection.Up) {
            this.rotateAxis = new Vec3(-1,0,0);
        }
        else if(dir == CodeDirection.Down) {
            this.rotateAxis = new Vec3(1, 0, 0);
        }
        else if(dir == CodeDirection.LeftDown) {
            this.rotateAxis = new Vec3(Math.sin(rad),0,Math.cos(rad));
        }
        else if(dir == CodeDirection.LeftUp) {
            this.rotateAxis = new Vec3(-Math.sin(rad),0,Math.cos(rad));
        }
        else if(dir == CodeDirection.RightDown) {
            this.rotateAxis = new Vec3(Math.sin(rad),0,-Math.cos(rad));
        }
        else if(dir == CodeDirection.RightUp) {
            this.rotateAxis = new Vec3(-Math.sin(rad),0,-Math.cos(rad));
        }
    }

    doMove(targetPos:Vec3,dir:CodeDirection) {
        this.moveTarget = targetPos;        // 这个是世界坐标...
        let currentWorldPos = this.node.getWorldPosition();         // 获得当前的世界坐标...

        let length = currentWorldPos.clone().subtract(this.moveTarget).length();
        this.spendTime = length / this.moveSpeed;
        let targetPos0 = new Vec3(this.node.worldPosition.x, this.node.worldPosition.y + 1.0, this.node.worldPosition.z);
        let targetPos1 = new Vec3(this.node.worldPosition.x, targetPos.y, this.node.worldPosition.z);
        tween(this.node).to(this.spendTime / 4, {worldPosition:targetPos0}).to(this.spendTime/4, {worldPosition:targetPos1}).to(this.spendTime / 2, {worldPosition:targetPos}).call(()=>{
            this.startAnim = false;
            this.model.eulerAngles = new Vec3(-90, 0, 0);
            this.node.worldPosition = targetPos;
        }).start();
        this.startRotate(dir);
        this.rotateSpeed = 180 / this.spendTime;
    }

    doRotate(angle) {
        let rotation = quat();
        let rad = misc.degreesToRadians(angle);
        this.currentRotateAngle += angle;
        Quat.rotateAround(rotation,this.model.rotation, this.rotateAxis, rad);
        this.model.rotation = rotation;
    }

    update(deltaTime: number) {
        if(this.startAnim) {
            let angle = this.rotateSpeed * deltaTime;
            this.doRotate(angle);
        }
    }
}


