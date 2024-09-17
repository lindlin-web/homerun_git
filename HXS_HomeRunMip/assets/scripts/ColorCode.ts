import { _decorator, Component, misc, Node, Quat, quat, tween, Vec3 } from 'cc';
import { ChipColor, CodeDirection } from './data/MyTableData';
import { AppNotify, NotifyMgrCls } from './controller/AppNotify';
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

    private color:ChipColor;
    start() {

    }

    public setColor(color:ChipColor) {
        this.color = color;
    }
    public getColor() {
        return this.color;
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

    doMove(targetPos:Vec3,dir:CodeDirection,tell,row:number,column:number) {
        this.moveTarget = targetPos;        // 这个是世界坐标...
        let currentWorldPos = this.node.getWorldPosition();         // 获得当前的世界坐标...

        let length = currentWorldPos.clone().subtract(this.moveTarget).length();
        this.spendTime = 0.35;
        let sub = targetPos.clone().subtract(this.node.worldPosition).normalize();

        let targetPos0 = new Vec3(this.node.worldPosition.x, this.node.worldPosition.y, this.node.worldPosition.z);
        let targetPos1 = new Vec3(targetPos.x, targetPos.y+1.4, targetPos.z);
        targetPos1 = targetPos0.add(sub);
        targetPos1.y = targetPos.y + 0.6;
        this.startRotate(dir);
        let targetRot0 = this.doRotate(90);
        let targetRot1 = this.doRotate(180);
        
        tween(this.model).to(this.spendTime / 2, {rotation:targetRot0}).to(this.spendTime / 2, {rotation:targetRot1}).start();
        tween(this.node).to(this.spendTime / 2, {worldPosition:targetPos1}).to(this.spendTime / 2, {worldPosition:targetPos}).call(()=>{
            this.startAnim = false;
            this.model.eulerAngles = new Vec3(-90, 0, 0);
            this.node.worldPosition = targetPos;
            if(tell) {
                NotifyMgrCls.getInstance().send(AppNotify.FlyAnimationDone,row,column);
            }
        }).start();
        this.rotateSpeed = 180 / this.spendTime;
    }

    doRotate(angle) {
        let rotation = quat();
        let rad = misc.degreesToRadians(angle);
        let temp = quat();
        Quat.fromEuler(temp,-90,0,0);
        Quat.rotateAround(rotation,temp, this.rotateAxis, rad);
        return rotation;
    }

    // update(deltaTime: number) {
    //     if(this.startAnim) {
    //         let angle = this.rotateSpeed * deltaTime;
    //         this.doRotate(angle);
    //     }
    // }
}


