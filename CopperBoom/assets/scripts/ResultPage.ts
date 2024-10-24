import { _decorator, Component, Node, tween, Tween, UITransform, v3 } from 'cc';
import { AppNotify, NotifyMgrCls } from './controller/AppNotify';
import { AudioMgr } from './AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('ResultPage')
export class ResultPage extends Component {

    myTween:Tween<Node>;

    @property(Node)
    continueNode:Node;

    @property(Node)
    downLoadNode:Node;
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
    }

    protected onDisable(): void {
        this.myTween.stop();
    }
    start() {

    }

    update(deltaTime: number) {
        
    }

    onDownload() {
        this.node.parent.active =  false;

        AudioMgr.Instance.butn.play();
    }

    onContinue() {
        this.node.parent.active = false;
        NotifyMgrCls.getInstance().send(AppNotify.ON_CONTINUE);
        AudioMgr.Instance.butn.play();
    }
}


