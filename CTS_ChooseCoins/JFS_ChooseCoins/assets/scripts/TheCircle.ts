import { _decorator, Component, Node, Quat, quat, tween } from 'cc';
import { AppNotify, NotifyMgrCls } from './controller/AppNotify';
const { ccclass, property } = _decorator;


const STATUS = {
    "SPEEDUP": 1,
    "KEEP" : 2,
    "TOTARGET":4,
    "BACK": 5,
}

const STATUSTIME = {
    "SPEEDUP":1,
    "KEEP":1,
    "TOTARGET":1,
    "BACK":0.5
}
@ccclass('TheCircle')
export class TheCircle extends Component {

    private doRotating:boolean = false;

    private currentTime:number = 0;

    private maxRotate:number = 30;

    private currentRotate:number = 0;


    private direction:number = 0;           // 0: left, 1: right

    private currentStatus:number = STATUS.SPEEDUP;      // 是 提高速度的阶段..

    private targetStartRotate:number = 0;



    private bbbbbb:number = 0;

    private bbbbbbbgap:number = 0;

    // @property(Node)
    // theSpecial:Node;

    start() {
        this.doRotating = false;
    }

    public set DoRotating(bo:boolean) {
        this.doRotating = bo;
    }

    public setDirection(num:number) {
        this.direction = num;
    }



    update(deltaTime: number) {
        if(!this.doRotating) {
            return;
        }

        this.currentTime += deltaTime;

        if(this.direction == 0) {           // 往左边旋转
            if(this.currentStatus == STATUS.SPEEDUP) {
                let speed = this.currentTime / STATUSTIME.SPEEDUP * this.maxRotate;
                speed = Math.min(speed, this.maxRotate);
                this.currentRotate += speed;
                
                
                if(this.currentTime >= STATUSTIME.SPEEDUP) {
                    this.currentStatus = STATUS.KEEP;
                }
            }
            if(this.currentStatus == STATUS.KEEP) {
                console.log("========到了保持的阶段了=========");
                this.currentRotate += this.maxRotate;
    
                let rotateOk = this.currentRotate % 360 >= 230;
                if(rotateOk && this.currentTime > (STATUS.SPEEDUP + STATUS.KEEP)) {
                    this.currentRotate = this.currentRotate % 360
                    this.currentStatus = STATUS.TOTARGET;
                    this.currentRotate -= 360 * 2;
                    this.currentTime = 0;
                    this.targetStartRotate = this.currentRotate;
                    let gap = 316 - this.targetStartRotate;
                }
            }
    
            if(this.currentStatus == STATUS.TOTARGET) {
                this.currentTime = this.currentTime >= 1 ? 1 : this.currentTime;
                let mygap = 1660 * this.currentTime + 1/2 * (-1660) * this.currentTime * this.currentTime;
    
                if(this.currentTime >= 1) {
                    this.currentRotate  = this.currentRotate;
                    this.currentTime = 0;
                    this.currentStatus = STATUS.BACK;

                    this.bbbbbb = this.currentRotate;

                    this.bbbbbbbgap = 360 - this.bbbbbb;
                }
                else {
                    this.currentRotate = this.targetStartRotate + mygap;
                }
            }

            if(this.currentStatus == STATUS.BACK) {
                this.currentRotate = this.bbbbbb + this.bbbbbbbgap * 2*this.currentTime;
                if(this.currentTime > 0.5) {
                    //AudioMgr.Instance.StopCircleTurn();
                    this.currentRotate = 360;
                    this.doRotating = false;
                    //this.theSpecial.active = true;
                    //AudioMgr.Instance.circleReward.play();
                    this.scheduleOnce(()=>{
                        NotifyMgrCls.getInstance().send(AppNotify.CIRCLEDONE);
                    },0.1);
                }
            }
        }
        else
        {
            this.maxRotate = -30;
            if(this.currentStatus == STATUS.SPEEDUP) {
                let speed = this.currentTime / STATUSTIME.SPEEDUP * this.maxRotate;
                speed = Math.max(speed, this.maxRotate);
                this.currentRotate += speed;
                
                
                if(this.currentTime >= STATUSTIME.SPEEDUP) {
                    this.currentStatus = STATUS.KEEP;
                }
            }
            if(this.currentStatus == STATUS.KEEP) {
                console.log("========到了保持的阶段了=========");
                this.currentRotate += this.maxRotate;
    
                let rotateOk = this.currentRotate % 360 <= -330;
                if(rotateOk && this.currentTime > (STATUS.SPEEDUP + STATUS.KEEP)) {
                    this.currentRotate = this.currentRotate % 360
                    this.currentStatus = STATUS.TOTARGET;
                    this.currentRotate += 360 * 2;
                    this.currentTime = 0;
                    this.targetStartRotate = this.currentRotate;
                    let gap = 316 - this.targetStartRotate;
                }
            }
    
            if(this.currentStatus == STATUS.TOTARGET) {
                this.currentTime = this.currentTime >= 1 ? 1 : this.currentTime;
                let mygap = 1490 * this.currentTime + 1/2 * (-1490) * this.currentTime * this.currentTime;
    
                if(this.currentTime >= 1) {
                    this.currentRotate  = this.currentRotate;
                    this.currentTime = 0;
                    this.currentStatus = STATUS.BACK;

                    this.bbbbbb = this.currentRotate;

                    this.bbbbbbbgap = -360 - this.bbbbbb;
                }
                else {
                    this.currentRotate = this.targetStartRotate - mygap;
                }
            }

            if(this.currentStatus == STATUS.BACK) {
                this.currentRotate = this.bbbbbb + this.bbbbbbbgap * 2*this.currentTime;
                if(this.currentTime > 0.5) {
                    //AudioMgr.Instance.StopCircleTurn();
                    this.currentRotate = -360;
                    //this.theSpecial.active = true;
                    //AudioMgr.Instance.circleReward.play();
                    this.scheduleOnce(()=>{
                        NotifyMgrCls.getInstance().send(AppNotify.CIRCLEDONE);
                    },0.1);
                    this.doRotating = false;
                }
            }
        }

        
        this.node.setRotationFromEuler(0 ,0,this.currentRotate);
    }

    doToTarget() {
        let qq = new Quat();
        Quat.fromAngleZ(qq, -160);
        console.log(qq, "========qq");
        tween(this.node).to(0.3, {rotation:qq}).start();
    }
}




