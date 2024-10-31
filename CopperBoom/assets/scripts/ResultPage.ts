import { _decorator, Component, Label, Node, tween, Tween, UITransform, v3 } from 'cc';
import { AppNotify, NotifyMgrCls } from './controller/AppNotify';
import { AudioMgr } from './AudioMgr';
import { GameControl } from './Framework/GameControl';
const { ccclass, property } = _decorator;

@ccclass('ResultPage')
export class ResultPage extends Component {

    myTween:Tween<Node>;

    @property(Node)
    continueNode:Node;

    @property(Node)
    downLoadNode:Node;

    private totalSecond:number = 10;

    @property(Label)
    countTimeLabel:Label;
    onEnable(): void {
        this.myTween = tween(this.node).repeatForever(tween().delay(1.3).repeat(1, tween().call(()=>{
            this.node.setRotationFromEuler(v3(0,0,2));
        }).delay(0.08).call(()=>{
            this.node.setRotationFromEuler(v3(0,0,-1));
        }).delay(0.08).call(()=>{
            this.node.setRotationFromEuler(v3(0,0,1));
        }).delay(0.08).call(()=>{
            this.node.setRotationFromEuler(v3(0,0,-1));
        }).delay(0.08).call(()=>{
            this.node.setRotationFromEuler(v3(0,0,0));
        }))).start();
        this.totalSecond = 10;
    }

    protected onDisable(): void {
        this.myTween.stop();
    }
    start() {

    }

    update(deltaTime: number) {
        this.totalSecond -= deltaTime;
        if(this.totalSecond <= 0) {
            this.node.parent.active = false;
            NotifyMgrCls.getInstance().send(AppNotify.ON_CONTINUE);
            return;
        }
        let vv = Math.floor(this.totalSecond * 100);
        let second = Math.floor(vv / 100);
        let secondstr = second + "";
        if(secondstr.length == 1) {
            secondstr = "0" + secondstr;
        }
        let left = Math.floor(vv % 100);

        let leftstr = left + "";
        if(leftstr.length == 1) {
            leftstr = "0" + leftstr;
        }
        this.countTimeLabel.string = secondstr + ":" + leftstr;

    }

    onDownload() {
        this.node.parent.active =  false;

        AudioMgr.Instance.butn.play();

        GameControl.DownloadClick();
    }

    onContinue() {
        this.node.parent.active = false;
        NotifyMgrCls.getInstance().send(AppNotify.ON_CONTINUE);
        AudioMgr.Instance.butn.play();
    }
}


