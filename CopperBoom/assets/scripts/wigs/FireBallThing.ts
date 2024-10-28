import { _decorator, Component, Node } from 'cc';
import { AppNotify, NotifyMgrCls } from '../controller/AppNotify';
import { AudioMgr } from '../AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('FireBallThing')
export class FireBallThing extends Component {
    start() {
        
    }


    protected onEnable(): void {
        AudioMgr.Instance.terror_smile.play();
    }

    update(deltaTime: number) {
        
    }

    FireBallFinished() {
        NotifyMgrCls.getInstance().send(AppNotify.ON_FIRE_CANNO_FINISHED);
    }

    FireCannoStart() {
        AudioMgr.Instance.fire.play();
    }
}


