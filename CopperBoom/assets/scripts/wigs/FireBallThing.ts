import { _decorator, Component, Node } from 'cc';
import { AppNotify, NotifyMgrCls } from '../controller/AppNotify';
const { ccclass, property } = _decorator;

@ccclass('FireBallThing')
export class FireBallThing extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }

    FireBallFinished() {
        NotifyMgrCls.getInstance().send(AppNotify.ON_FIRE_CANNO_FINISHED);
    }
}


