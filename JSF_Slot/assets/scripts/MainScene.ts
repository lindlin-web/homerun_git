import { _decorator, Component, EventTouch, Input, input, Label, Node, Vec2,screen, UITransform, v3, Widget } from 'cc';
import { TheCircle } from './TheCircle';
import { AppNotify, NotifyMgrCls } from './controller/AppNotify';
import { PopAlert } from './PopAlert';
import { SpecialLabel } from './wigs/SpecialLabel';
import { AudioMgr } from './AudioMgr';
import { GameControl } from './Framework/GameControl';
const { ccclass, property } = _decorator;

@ccclass('MainScene')
export class MainScene extends Component {
    
    @property(TheCircle)
    theCircle:TheCircle;

    @property(Node)
    popUpNode:Node;

    @property(Node)
    tiger:Node;

    @property(Node)
    popAlert:Node;

    @property(Node)
    bg:Node;
    
    @property(Node)
    theTipHand:Node;

    @property(Node)
    icon:Node;

    @property(Node)
    downLoadNode:Node;

    private startLocation:Vec2;
    
    private notSetting:boolean = true;

    private initCoinValue:number = 1380;        // 假装有初始化的时候有这么多的金币...
    onLoad(): void {
        
    }

    onStartClick() {
        this.popUpNode.active = false;
        this.tiger.active = true;
        this.theCircle.node.parent.active = false;
        AudioMgr.Instance.butn.play();
    }

    start(): void {
        NotifyMgrCls.getInstance().observe(AppNotify.CIRCLEDONE, this.onCircleDone.bind(this));
        NotifyMgrCls.getInstance().observe(AppNotify.SPINDONE, this.onSpinDone.bind(this));

        this.theCircle.node.parent.on(Node.EventType.TOUCH_START, this.onTouchHandle,this);
        this.theCircle.node.parent.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);

        
        this.popUpNode.active = false;

        this.popAlert.active = false;

        this.theTipHand.active = true;

        screen.on("window-resize", this.onWindowResize.bind(this), this);
        let size = screen.windowSize;
        this.onWindowResize(size.width, size.height);
    }

    onWindowResize(width:number, height:number) { 
        let containerWidth:number = this.theCircle.node.parent.getComponent(UITransform).contentSize.width;

        
        let scale = height / (720);

        let totalWidth = containerWidth * scale;
        if(height > width) {

            this.icon.setScale(v3(0.25,0.25,1));
            this.downLoadNode.setScale(v3(0.25,0.25,1));
            this.icon.getComponent(Widget).left = 20;
            this.downLoadNode.getComponent(Widget).right = 20;
            if(totalWidth > width) {
                let toScale = width / totalWidth;
                this.theCircle.node.parent.setScale(v3(toScale-0.01, toScale-0.01, 1));
            }
            else {
                this.theCircle.node.parent.setScale(v3(1, 1, 1));
            }
        }
        else {
            this.icon.setScale(v3(0.4,0.4,1));
            this.downLoadNode.setScale(v3(0.4,0.4,1));
            this.icon.getComponent(Widget).left = 285.25;
            this.downLoadNode.getComponent(Widget).right = 243.177;
            this.theCircle.node.parent.setScale(v3(1, 1, 1));
        }

        let tigerWidth:number = this.tiger.getComponent(UITransform).contentSize.width;
        let totalTiger = tigerWidth * scale;
        if(height > width) {
            if(totalTiger > width) {
                let toScale = width / totalTiger;
                this.tiger.setScale(v3(toScale-0.01, toScale-0.01, 1));
            }
            else {
                this.tiger.setScale(v3(0.9, 0.9, 0.9));
            }
        }
        else {
            this.tiger.setScale(v3(0.9, 0.9, 0.9));
        }


        let popWidth:number = this.popUpNode.getComponent(UITransform).contentSize.width;
        let totalPop = popWidth * scale;
        if(height > width) {
            if(totalPop > width) {
                let toScale = width / totalPop;
                this.popUpNode.setScale(v3(toScale-0.01, toScale-0.01, 1));
            }
            else {
                this.popUpNode.setScale(v3(1, 1, 1));
            }
        }
        else {
            this.popUpNode.setScale(v3(1, 1, 1));
        }


        let popAlertWidth:number = this.popAlert.getComponent(UITransform).contentSize.width;
        let totalPopAlert = popAlertWidth * scale;
        if(height > width) {
            this.bg.setScale(v3(0.5,0.5,0.5));
            if(totalPopAlert > width) {
                let toScale = width / totalPopAlert;
                this.popAlert.setScale(v3(toScale-0.01, toScale-0.01, 1));
            }
            else {
                this.popAlert.setScale(v3(1, 1, 1));
            }
        }
        else {
            this.popAlert.setScale(v3(1, 1, 1));
            this.bg.setScale(v3(1.2,1.2,1.2));
        }
        
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
            AudioMgr.Instance.PlayCircleTurn();
            this.theCircle.setDirection(right);
            
            this.theCircle.DoRotating = true;
            this.notSetting = false;
            this.theTipHand.active = false;
        }
    }

    public downLoadClick() {
        GameControl.DownloadClick();
    }

    onTouchHandle(event:EventTouch) {

        AudioMgr.Instance.PlayBgm();
        this.startLocation = event.touch.getLocation();
    }

    onSpinDone(time:number) {
        this.popAlert.getComponent(PopAlert).setTime(time);
    }

    onCircleDone() {
        this.popUpNode.active = true;

        AudioMgr.Instance.popUp.play();
    }

}


