import { _decorator, Component, instantiate, Node, ParticleSystem2D, Prefab, tween, UITransform, v3, Vec3,screen, Tween, input, Input, EventTouch, Vec2 } from 'cc';
import { AppNotify, NotifyMgrCls } from './controller/AppNotify';
import { FlyFire } from './FlyFire';
import { MyData } from './data/MyData';
import { TheCircle } from './TheCircle';
import { AudioMgr } from './AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('GameMain')
export class GameMain extends Component {

    @property(Node)
    flyFire:Node;

    @property(Node)
    circleCenter:Node;              // 就是转盘的中心

    @property(Prefab)
    explode:Prefab;
    private circleWorldPosition:Vec3;

    @property(Node)
    grand:Node

    @property(Node)
    major:Node

    @property(Node)
    minor:Node;

    @property(Node)
    threeTime:Node;

    @property(Node)
    twoTime:Node;

    @property(Node)
    oneTime:Node;

    @property(Node)
    theBorder:Node;

    @property(Node)
    treasureGod:Node;

    @property(TheCircle)
    theCircle:TheCircle;

    @property(Node)
    finalPage:Node;

    @property(Node)
    emitterNode:Node;

    @property(Node)
    handTip:Node;

    private startLocation:Vec2;

    private notSetting:boolean = true;

    @property(Node)
    theTipHand:Node;

    private afterTheZoomOut:boolean = false;                    // 是否是在 放大之后....
    start() {

        this.showCircleContent();
        this.circleWorldPosition = this.circleCenter.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0));
        NotifyMgrCls.getInstance().observe(AppNotify.TurnAnimationDone, this.onTurnAnimationDone.bind(this));
        NotifyMgrCls.getInstance().observe(AppNotify.FlyAnimationDone, this.onFlyAnimationDone.bind(this));
        NotifyMgrCls.getInstance().observe(AppNotify.ExplorAnimationDone, this.onExplorAnimationDone.bind(this));
        NotifyMgrCls.getInstance().observe(AppNotify.CIRCLEDONE, this.onCircleDone.bind(this));
        NotifyMgrCls.getInstance().observe(AppNotify.PREANIMATIONDONE, ()=>{
            this.handTip.active =  true;
        });

        NotifyMgrCls.getInstance().observe(AppNotify.STARTDOREVERSETHING, ()=>{
            this.handTip.active =  false;
        });

        input.on(Input.EventType.TOUCH_START, ()=>{
            AudioMgr.Instance.PlayBgm();
        },this);

        let god = this.treasureGod.getChildByName("treasure_god");
        tween(god).repeatForever(tween(god).by(0.8,{scale:v3(-0.05,-0.05,0.0)}).by(0.8,{scale:v3(0.05,0.05,0)})).start();
        screen.on("window-resize", this.onWindowResize.bind(this), this);
        let size = screen.windowSize;
        this.onWindowResize(size.width, size.height);

        this.theTipHand.active = false;
    }

    onWindowResize(width:number, height:number) {
        if(width > height) {
            this.theBorder.setScale(v3(1.5,1.5,1.0));
            this.theBorder.setPosition(v3(994,-50,1.0));
            this.treasureGod.getChildByName("treasure_god").setScale(v3(2.5,2.5,1.0));
            this.treasureGod.getChildByName("treasure_god").setPosition(v3(-11,-370,1.0));
            let god = this.treasureGod.getChildByName("treasure_god");
            Tween.stopAllByTarget(god);
            tween(god).repeatForever(tween(god).by(1.2,{scale:v3(-0.05,-0.05,0.0)}).by(1.2,{scale:v3(0.05,0.05,0)})).start();
            this.theCircle.node.parent.setScale(v3(2.0,2.0,1.0));
            this.theCircle.node.parent.setPosition(v3(-800.0,-28.777,1.0));

            if(this.afterTheZoomOut) {
                this.theCircle.node.parent.setPosition(v3(-800.0,172.777,1.0));
            }
        }
        else {
            this.theBorder.setScale(v3(1.0,1.0,1.0));
            this.theBorder.setPosition(v3(0,-403.177,1.0));
            this.treasureGod.getChildByName("treasure_god").setScale(v3(1.0,1.0,1.0));
            this.treasureGod.getChildByName("treasure_god").setPosition(v3(-11.766,222,1.0));
            let god = this.treasureGod.getChildByName("treasure_god");
            Tween.stopAllByTarget(god);
            tween(god).repeatForever(tween(god).by(1.2,{scale:v3(-0.05,-0.05,0.0)}).by(1.2,{scale:v3(0.05,0.05,0)})).start();
            this.theCircle.node.parent.setScale(v3(1.0,1.0,1.0));
            this.theCircle.node.parent.setPosition(v3(0,88.777,1.0));

            if(this.afterTheZoomOut) {
                this.theBorder.setPosition(v3(0,-703.177,1.0));
            }
        }
        this.scheduleOnce(()=>{
            this.circleWorldPosition = this.circleCenter.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0));
        },0.1);
        
    }

    /** 当转动结束的时候.... */
    onCircleDone() {
        AudioMgr.Instance.circle_stop.play();
        AudioMgr.Instance.explode_gold.play();
        this.finalPage.active = true;   
        this.emitterNode.active = true;    
        this.finalPage.setScale(v3(0.0,0.0,1.0));
        tween(this.finalPage).delay(0.1).to(0.1,{scale:v3(1.0,1.0,1.0)}).start();
    }

    showCircleContent() {
        for(let i = 0; i < this.grand.children.length; i++) {
            let child = this.grand.children[i];
            child.active = false;
        }
        for(let i = 0; i < this.major.children.length; i++) {
            let child = this.major.children[i];
            child.active = false;
        }
        for(let i = 0; i < this.minor.children.length; i++) {
            let child = this.minor.children[i];
            child.active = false;
        }

        let turningTime = MyData.getInstance().getTurningTime();
        if(turningTime == 0) {
            this.grand.getChildByName("zero").active = true;
            this.major.getChildByName("zero").active = true;
            this.minor.getChildByName("zero").active = true;
        }
        else if(turningTime == 1) {
            this.grand.getChildByName("first").active = true;
            this.major.getChildByName("first").active = true;
            this.minor.getChildByName("first").active = true;

            this.grand.getChildByName("spriteFrame").active = true;
            this.major.getChildByName("spriteFrame").active = true;
            this.minor.getChildByName("spriteFrame").active = true;
        }
        else if(turningTime == 2) {
            this.grand.getChildByName("first").active = true;
            this.major.getChildByName("first").active = true;
            this.minor.getChildByName("first").active = true;
            this.grand.getChildByName("second").active = true;
            this.major.getChildByName("second").active = true;
            this.minor.getChildByName("second").active = true;

            this.grand.getChildByName("spriteFrame").active = true;
            this.major.getChildByName("spriteFrame").active = true;
            this.minor.getChildByName("spriteFrame").active = true;
        }
        else if(turningTime == 3) {
            this.grand.getChildByName("first").active = true;
            this.major.getChildByName("first").active = true;
            this.minor.getChildByName("first").active = true;
            this.grand.getChildByName("second").active = true;
            this.major.getChildByName("second").active = true;
            this.minor.getChildByName("second").active = true;

            this.grand.getChildByName("spriteFrame").active = true;
            this.major.getChildByName("spriteFrame").active = true;
            this.minor.getChildByName("spriteFrame").active = true;
            this.doTheCircleTurningThing();
        }
    }

    /** 开始做旋转的转动的事情 */
    doTheCircleTurningThing() {
        let size = screen.windowSize;
        if(size.width > size.height) {
            // this.theCircle.DoRotating = true;
            // this.theCircle.setDirection(0);
        } else {
            tween(this.theBorder).by(0.6, {position:v3(0,-300, 0)}).start();
            tween(this.treasureGod).by(0.6, {position:v3(0,-200,0), scale:v3(0.15,0.15,1)}).call(()=>{
                // this.theCircle.DoRotating = true;
                // this.theCircle.setDirection(0);
            }).start();
        }

        AudioMgr.Instance.circle_zoom_in.play();

        this.afterTheZoomOut = true;                // 已经到了放大之后了...
        
        this.theCircle.node.parent.on(Node.EventType.TOUCH_START, this.onTouchHandle,this);
        this.theCircle.node.parent.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);

        this.theTipHand.active = true;
    }

    /** 特效完成的时候 */
    onExplorAnimationDone() {
        this.showCircleContent();
    }

    /** 转动的动画已经结束了 */
    onTurnAnimationDone(fromPosWorld:Vec3) {
        let turningTime = MyData.getInstance().getTurningTime();
        if(turningTime == 1) {
            this.threeTime.active = false;
        }
        else if(turningTime == 2) {
            this.twoTime.active = false;
        } 
        else if(turningTime == 3) {
            this.oneTime.active = false;
        }
        let fromLoc:Vec3 = this.flyFire.parent.getComponent(UITransform).convertToNodeSpaceAR(fromPosWorld);
        let toLoc:Vec3 = this.flyFire.parent.getComponent(UITransform).convertToNodeSpaceAR(this.circleWorldPosition);
        this.flyFire.active = true;
        this.flyFire.getComponent(FlyFire).setFlyPosition(fromLoc, toLoc);

        AudioMgr.Instance.xiu.play();
    }

    onFlyAnimationDone() {

        AudioMgr.Instance.reward.play();
        let exp = instantiate(this.explode);
        let worldPos = this.circleCenter
        let pos = this.node.getComponent(UITransform).convertToNodeSpaceAR(this.circleWorldPosition);
        exp.setPosition(pos);
        this.node.addChild(exp);
        this.scheduleOnce(()=>{
            NotifyMgrCls.getInstance().send(AppNotify.ExplorAnimationDone);
        },0.6);
    }

    update(deltaTime: number) {
        
    }

    onTouchHandle(event:EventTouch) {
        this.startLocation = event.touch.getLocation();
    }

    onTouchEnd(event:EventTouch) {
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

        if(this.notSetting && this.startLocation && qualify) {
            this.theCircle.setDirection(right);
            AudioMgr.Instance.circle_go.play();
            this.theCircle.DoRotating = true;
            this.notSetting = false;
            this.theTipHand.active = false;
        }
    }
}


