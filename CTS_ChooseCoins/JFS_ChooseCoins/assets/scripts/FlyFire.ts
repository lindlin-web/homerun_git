import { _decorator, Component, Node, ParticleSystem2D, tween, v2, v3, Vec3 } from 'cc';
import { AppNotify, NotifyMgrCls } from './controller/AppNotify';
const { ccclass, property } = _decorator;

@ccclass('FlyFire')
export class FlyFire extends Component {
    start() {
    }



    setFlyPosition(fromPos:Vec3, toPos:Vec3) {

        this.node.setPosition(fromPos);
        let particle = this.node.getComponent(ParticleSystem2D);
        
        let vec = v2(fromPos.x - toPos.x, fromPos.y - toPos.y);
        let angle = Math.atan2(vec.y, vec.x);
        angle = angle * 180 / Math.PI;
        particle.angle = angle;

        tween(this.node).to(0.6, {position:toPos}).call(()=>{
            this.node.setPosition(v3(-1000, -1000,0));
            NotifyMgrCls.getInstance().send(AppNotify.FlyAnimationDone)
        }).start();
    }

    update(deltaTime: number) {
        
    }
}


