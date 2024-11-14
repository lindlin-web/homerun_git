import { _decorator, Component, EventTouch, Node, tween, v3, Vec2,Animation,screen } from 'cc';
import { TheCircle } from './wigs/TheCircle';
import { AppNotify, NotifyMgrCls } from './controller/AppNotify';
import { DogMachine } from './DogMachine';
import { AudioMgr } from './AudioMgr';
import { GameMain } from './GameLogic/GameMain';
const { ccclass, property } = _decorator;

@ccclass('MainScene')
export class MainScene extends Component {
    
    @property(TheCircle)
    theCircle:TheCircle;

    @property(TheCircle)
    theSecondCircle:TheCircle;              // 第二个圈圈...

    @property(Node)
    theGlory:Node;

    @property(Node)
    theBorder:Node;

    private startLocation:Vec2;
    
    private notSetting:boolean = true;

    private circleTime:number = 0;          // 转动的次数


    @property(Node)
    totalCircleNode:Node;

    @property(Node)
    tigerNode:Node;

    @property(Node)
    theTip:Node = null;

    @property(Node)
    theTip2:Node = null;



    @property(Node)
    handTipForCircle:Node;

    @property(Node)
    handTipForTiger:Node;


    /** 点击开始的时候 */
    onBtnClick() {  
        this.theTip.active = false;
        this.totalCircleNode.active = false;

        this.tigerNode.active = true;
        this.theBorder.active = true;

        this.handTipForTiger.active = true;
        this.handTipForTiger.getComponent(Animation).play();

        this.tigerNode.getComponent(DogMachine).setQualify(true);

        AudioMgr.Instance.coinDrop.stop();

        AudioMgr.Instance.butn.play();
    }

    onLoad() {
        this.theBorder.active = false;
        this.handTipForTiger.active = false;
    }

    start() {
        this.theCircle.node.parent.on(Node.EventType.TOUCH_START, this.onTouchHandle, this);
        this.theCircle.node.parent.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);

        this.node.on(Node.EventType.TOUCH_START, ()=>{
            AudioMgr.Instance.PlayBgm();
            GameMain.instance.clickDown();
        }, this);
        NotifyMgrCls.getInstance().observe(AppNotify.CIRCLEDONE, this.onCircleDone.bind(this));
        NotifyMgrCls.getInstance().observe(AppNotify.SPINDONE, this.onSpinDone.bind(this));
        this.theTip.active = false;


        screen.on("window-resize", this.onWindowResize.bind(this), this);
        let size = screen.windowSize;
        this.onWindowResize(size.width, size.height);

        this.scheduleOnce(()=>{
            GameMain.instance.clickDown();
        }, 30);
    }

    onWindowResize(width:number, height:number) { 
        if(height > width) {
            this.tigerNode.parent.parent.setScale(v3(1.0, 1.0, 1.0));
        } else {
            this.tigerNode.parent.parent.setScale(v3(1.5, 1.5, 1.5));
        }
    }

    onDoSpin() {
        GameMain.instance.clickDown();
        AudioMgr.Instance.PlayBgm();
        if(this.notSetting && this.circleTime == 0) {
            this.theCircle.setDirection(1);
            this.theCircle.DoRotating = true;
            this.notSetting = false;

            this.handTipForCircle.active = false;

            AudioMgr.Instance.circleTurn.play();
        }

        if(this.notSetting && this.circleTime == 1) {
            this.theSecondCircle.setDirection(1);
            this.theSecondCircle.DoRotating = true;
            this.notSetting = false;

            this.handTipForCircle.active = false;
            AudioMgr.Instance.circleTurn.play();
        }
    }

    onSpinDone() {
        this.theTip2.active = true;
        AudioMgr.Instance.jackpotgold.play();
        this.scheduleOnce(()=>{
            AudioMgr.Instance.coinDrop.play();
        },0.1);
        
    }

    onDownLoadClick() {
        AudioMgr.Instance.butn.play();
    }

    onCircleDone() {
        this.circleTime++;
        
        if(this.circleTime == 1) {
            tween(this.theCircle.node).to(0.1, {scale:v3(0.65,0.65,1)}).call(()=>{
                this.theGlory.active = false;
                this.notSetting = true;
            }).start();

            this.handTipForCircle.active = true;
            this.handTipForCircle.getComponent(Animation).play();
        }
        else if(this.circleTime == 2) {
            this.theTip.active = true;

            AudioMgr.Instance.popUp.play();

            this.scheduleOnce(()=>{
                AudioMgr.Instance.coinDrop.play();
            },0.14);
        }
    }

    onTouchEnd(event:EventTouch) {
        GameMain.instance.clickDown();
        let location = event.touch.getLocation();
        let qualify = false;
        let right:number = 1;
        if(this.startLocation) {
            let gapx = location.x - this.startLocation.x;
            let gapy = location.y - this.startLocation.y;
            let distance = Math.sqrt(gapx * gapx + gapy * gapy);
            if(distance >= 5) {
                qualify = true;
                let angle =  Math.atan2(gapy, gapx);
                angle = angle * 180 / Math.PI;
 
                if(angle > -90 && angle < 90) {
                    right = 1;
                } else {
                    right = 0;
                }
            }
        }
 
        if(this.notSetting && this.startLocation && qualify && this.circleTime == 0) {
            this.theCircle.setDirection(right);
            this.theCircle.DoRotating = true;
            this.notSetting = false;

            this.handTipForCircle.active = false;

            AudioMgr.Instance.circleTurn.play();
        }

        if(this.notSetting && this.startLocation && qualify && this.circleTime == 1) {
            this.theSecondCircle.setDirection(right);
            this.theSecondCircle.DoRotating = true;
            this.notSetting = false;

            this.handTipForCircle.active = false;
            AudioMgr.Instance.circleTurn.play();
        }
    }

    onTouchHandle(event:EventTouch) {
        GameMain.instance.clickDown();
        AudioMgr.Instance.PlayBgm();
        this.startLocation = event.touch.getLocation();
    }
}


