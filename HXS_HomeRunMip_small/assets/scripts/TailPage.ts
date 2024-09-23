import { _decorator, Component, math, Node, UITransform, Vec2, Vec3 } from 'cc';
import { GameControl } from './Framework/GameControl';
const { ccclass, property } = _decorator;

@ccclass('TailPage')
export class TailPage extends Component {

    public static Instance:TailPage = null;

    public totalNum:number = 10;
    private currentNum:number = 0;
    @property({type:Node})
    mask:Node = null;

    @property({type:Node})
    particleNode:Node = null;
    
    private initPosition:Vec2 = new Vec2(-248,-9.052);
    start() {
        TailPage.Instance = this;
        this.node.active = false;
        this.particleNode.active = false;
    }
    onShowPage() {
        this.particleNode.active = false;
        this.node.active = true;
    }

    public plusAdd() {
        this.currentNum += 1;
        let percent = this.currentNum / this.totalNum;
        percent = percent >= 1 ? 1 :percent;
        if(percent >= 1) {
            this.particleNode.active = false;
        }
        else if(percent <= 0) {
            this.particleNode.active = false;
        }
        else {
            this.particleNode.active = true;
        }
        let myWidth = percent * 500;
        let pos:Vec3 = new Vec3(0, 0,0);
        pos.x = this.initPosition.x + myWidth;
        pos.y = this.initPosition.y;
        this.particleNode.setPosition(pos);
        this.mask.getComponent(UITransform).setContentSize(myWidth, 30);
    }

    clickDown() {
        GameControl.DownloadClick();
    }

    update(deltaTime: number) {
        
    }
}


