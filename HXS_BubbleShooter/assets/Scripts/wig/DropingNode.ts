import { _decorator, Component, Node, v2, v3, Vec2, Vec3 } from 'cc';
import { AudioMgr } from '../AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('DropingNode')
export class DropingNode extends Component {
    private wight = 0.25;       // 假定这个重量是 0.25kg...

    private speed:Vec2 = v2(0, 0);

    private usedTime:number = 0;

    private isDoDroping:boolean = false;

    private initPositing:Vec3 = v3(0, 0, 0);
    start() {
        let pos:Vec3 = this.node.getPosition();
        this.initPositing = v3(pos.x,pos.y,pos.z);
    }   

    doDroping() {
        let speedX = Math.random() * 50 - 25;
        let speedZ = Math.random() * 10 - 10;
        this.speed = v2(speedX, speedZ);
        this.isDoDroping = true;
        AudioMgr.Instance.delet.play();
    }

    update(deltaTime: number) {
        if(this.isDoDroping) {
            this.usedTime += deltaTime;
            let posx = this.initPositing.x + this.speed.x * this.usedTime;
            let posz = this.initPositing.z + this.speed.y * this.usedTime + 4.5 * 9.8 * this.usedTime * this.usedTime;
            this.node.position = v3(posx, this.initPositing.y, posz);
        }

    }
}


