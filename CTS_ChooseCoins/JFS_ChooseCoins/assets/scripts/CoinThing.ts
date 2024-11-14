import { _decorator, CCFloat, Component, Node, Sprite, SpriteFrame, v3,Animation, Material, Vec2, Vec3, tween, Quat, NodeEventType, UITransform } from 'cc';
import { MyData } from './data/MyData';
import { AppNotify, NotifyMgrCls } from './controller/AppNotify';
import { AudioMgr } from './AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('CoinThing')
export class CoinThing extends Component {
    

    public static isOnTurning:boolean = false;
    @property([SpriteFrame])
    sfs:SpriteFrame[] = [];


    @property(CCFloat)
    myIndex:number;

    private isRewardTurning:boolean = false;


    /** 光束宽度 */
    private lightWidth:number = 0.2;

    /** 时间 */
    private loopTime:number = 1.0;

    /** timeInterval */
    private timeInterval = 3.0;

    private time:number = 0;

    private material:Material = null;
    private startPos = 0;
    private moveLength = 0;
    private speed = 0;
    private dttime = 0;

    private isStartShinning:boolean = false;


    private isDoingRotate:boolean = false;         // 是否是开始了旋转....
    private myRotateSpeed:number = 0;               // 我的旋转的角度....
    private currentRotate:number = 0;               // 当前的旋转角度....


    private alreadyReverse:boolean = false;         // 是否已经反转了....

    protected start(): void {
        this.resetProperty();
        this.material = this.node.getComponent(Sprite).getMaterialInstance(0)!;   //获取材质
        this.material.setProperty("lightCenterPoint", new Vec2(-22.0, 0.0));          //设置材质对应的属性
        this.node.getComponent(Sprite).spriteFrame = this.sfs[this.sfs.length - 1];     // 用最后一个图片的样式。
        this.scheduleOnce(()=>{
            this.doTurning(false);
            //this.doShuffle(v3(0,-50,0),0.2, 1.5, 1000);
        },1);
        this.scheduleOnce(()=>{
            this.doReverseTurning();
        }, 2.0);

        this.scheduleOnce(()=>{
            this.doShuffle(v3(0,-50,0),0.2, 1.5, 1000);
        },3);
    }
    
    /** 就是做一次普通的旋转 */
    doTurning(isRewardTurning:boolean) {
        let animation = this.node.getComponent(Animation);
        this.isRewardTurning = isRewardTurning;
        animation.play("gold_turn");
    }

    /** 反向旋转 */
    doReverseTurning() {
        let animation = this.node.getComponent(Animation);
        animation.play("gold_reverse_turn");
    }

    /** 当翻转结束的时候 */
    onTurningFinished() {
        let currentTime = MyData.getInstance().getTurningTime();        // 获得当前转动了第几次
        this.scheduleOnce(()=>{
            if(this.isRewardTurning) {
                let indexs = [2,5,1];
                console.log(indexs[currentTime], "===============indexs[currentTime]");
                this.node.getComponent(Sprite).spriteFrame = this.sfs[indexs[currentTime]];
                let time = MyData.getInstance().getTurningTime();
                time = time + 1;
                MyData.getInstance().setTurningTime(time);

                this.resetProperty();
                this.isStartShinning = true;
                this.node.setScale(v3(1.0, 1.0, 1.0));
                let worldPos = this.node.getComponent(UITransform).convertToWorldSpaceAR(v3(0,0,0));
                NotifyMgrCls.getInstance().send(AppNotify.TurnAnimationDone, worldPos);      // 传递node 的位置.
            } 
            else {
                this.node.getComponent(Sprite).spriteFrame = this.sfs[this.myIndex];
                this.node.setScale(v3(1.0, 1.0, 1.0));
            }
            this.scheduleOnce(()=>{
                CoinThing.isOnTurning = false;
            },0.7);
            
        },0.08);
    }

    doShuffle(toPos:Vec3,moveTime:number, rotateTime:number,rotateSpeed:number) {
        let originalPos = this.node.getPosition();
        tween(this.node).to(moveTime, {position:toPos}).call(()=>{
            this.isDoingRotate = true;
            this.myRotateSpeed = rotateSpeed;
        }).delay(rotateTime).call(()=>{
            this.isDoingRotate = false;
            let out = new Quat();
            Quat.fromEuler(out, 0,0,0);
            this.node.setRotation(out);
            this.afterInitAction();
        }).to(moveTime, {position:originalPos}).call(()=>{

            NotifyMgrCls.getInstance().send(AppNotify.PREANIMATIONDONE);            // 前置的一些动画，已经完成...

        }).start();
    }

    /** 动作之后 */
    afterInitAction() {
        this.node.on(NodeEventType.TOUCH_START,this.onTouchStart, this);
    }

    /** 触摸开始了 */
    onTouchStart() {
        AudioMgr.Instance.PlayBgm();
        MyData.getInstance().doDownloadClick();         // 做下载的操作...
        let turningTime = MyData.getInstance().getTurningTime();
        if(turningTime <= 2 && !this.alreadyReverse && !CoinThing.isOnTurning) {
            CoinThing.isOnTurning = true;
            AudioMgr.Instance.reverse_gold.play();
            this.doTurning(true);
            this.alreadyReverse = true;
            NotifyMgrCls.getInstance().send(AppNotify.STARTDOREVERSETHING);            // 前置的一些动画，已经完成...
        }
    }

    resetProperty() {
        this.time = 0;
        this.dttime = 0;
        this.startPos = -this.lightWidth / 2;
        this.moveLength = this.lightWidth + 1;
        this.speed = this.moveLength / this.loopTime;
        this.time = this.startPos;
    }

    onTurningReverseFinished() {
        this.scheduleOnce(()=>{
            this.node.getComponent(Sprite).spriteFrame = this.sfs[this.sfs.length - 1];     // 用最后一个图片的样式。
            this.node.setScale(v3(1.0, 1.0, 1.0));
        }, 0.08);
        
    }

    update(dt: number): void {

        if(this.isDoingRotate) {
            let quat = new Quat();
            this.node.getRotation(quat);
            this.currentRotate += this.myRotateSpeed * dt;
            Quat.fromEuler(quat,0,0, this.currentRotate);
            this.node.setRotation(quat);
        }
        if(!this.isStartShinning) {
            return;
        }
        this.time += dt * this.speed;
        this.dttime += dt;
        this.material.setProperty("lightCenterPoint", new Vec2(this.time, this.time));          //设置材质对应的属性

        if (this.dttime > this.loopTime + this.timeInterval) {
            this.time = this.startPos;
            this.dttime = 0;
            this.isStartShinning = false;
        }
    }
}


