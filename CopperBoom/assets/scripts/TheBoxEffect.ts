import { _decorator, Component, Node, NodeEventType, tween, Tween,Animation, UITransform,v3, director } from 'cc';
import { TargetEmitter } from './TargetEmitter';
import { SteeredVehicleThing } from './wigs/SteeredVehicleThing';
import { Vector2D } from './wigs/Vector2D';
import { AppNotify, NotifyMgrCls } from './controller/AppNotify';
import { AudioMgr } from './AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('TheBoxEffect')
export class TheBoxEffect extends Component {
    @property(Node)
    box1:Node;

    @property(Node)
    box2:Node;

    @property(Node)
    box3:Node;

    @property(Node)
    hand:Node;

    @property(Node)
    targetNode:Node;

    private handTween:Tween<Node> = null;
    onLoad(): void {
        this.box1.on(NodeEventType.TOUCH_END, this.onTouchEnd, this);
        this.box2.on(NodeEventType.TOUCH_END, this.onTouchEnd, this);
        this.box3.on(NodeEventType.TOUCH_END, this.onTouchEnd, this);

        this.targetNode = director.getScene().getChildByName("Canvas").getChildByName("coinLabel").getChildByName("Label");
    }

    onTouchEnd(event) {
        let node:Node = event.currentTarget;
        let nameof = node.name;
        let result = 0;
        if(nameof.indexOf("1") >= 0) {
            result = 1;
        }
        else if(nameof.indexOf("2") >= 0) {
            result = 2;
        }
        else if(nameof.indexOf("3") >= 0) {
            result = 3;
        }
        node.setSiblingIndex(999);
        tween(node).to(0.3, {position:v3(0,0,0),scale:v3(3, 3, 3)}).call(()=>{
            node.getComponent(Animation).play();
            AudioMgr.Instance.box_open.play();
        }).delay(0.8).call(()=>{
            this.node.removeFromParent();
            this.node = null;
        }).delay(0.1).call(()=>{
            NotifyMgrCls.getInstance().send(AppNotify.ON_BOX_OPEND,result);
        }).start();
    }

    onDisable(): void {
        this.handTween.stop();
    }

    onEnable(): void {
        this.hand.setPosition(this.box1.getPosition());
        this.handTween = tween(this.hand).repeatForever(tween(this.hand).to(0.6, {position:this.box2.getPosition()}).call(()=>{
            this.hand.getComponent(Animation).play();
        }).delay(0.6).to(0.6, {position:this.box3.getPosition()}).call(()=>{
            this.hand.getComponent(Animation).play();
        }).delay(0.6).to(0.6, {position:this.box1.getPosition()}).call(()=>{
            this.hand.getComponent(Animation).play();
        }).delay(0.6)).start();

        for(let i = 0; i < this.box1.children.length; i++) {
            let child = this.box1.children[i];
            child.active = false;
        }

        for(let i = 0; i < this.box2.children.length; i++) {
            let child = this.box2.children[i];
            child.active = false;
        }

        for(let i = 0; i < this.box3.children.length; i++) {
            let child = this.box3.children[i];
            child.active = false;
        }
    }
}


