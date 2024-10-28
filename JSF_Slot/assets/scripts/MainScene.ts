import { _decorator, Component, Node } from 'cc';
import { TheCircle } from './TheCircle';
import { AppNotify, NotifyMgrCls } from './controller/AppNotify';
import { PopAlert } from './PopAlert';
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
    
    
    onLoad(): void {
        
    }

    onStartClick() {
        this.popUpNode.active = false;
        this.tiger.active = true;
        this.theCircle.node.parent.active = false;
    }

    start(): void {
        NotifyMgrCls.getInstance().observe(AppNotify.CIRCLEDONE, this.onCircleDone.bind(this));
        NotifyMgrCls.getInstance().observe(AppNotify.SPINDONE, this.onSpinDone.bind(this));
        this.popUpNode.active = false;

        this.popAlert.active = false;
    }

    onSpinDone(time:number) {
        this.popAlert.getComponent(PopAlert).setTime(time);
    }

    onCircleDone() {
        this.popUpNode.active = true;
    }

}


