import { _decorator, Component, math, Node, UITransform, Vec3 } from 'cc';
import { GameControl } from './Framework/GameControl';
const { ccclass, property } = _decorator;

@ccclass('TailPage')
export class TailPage extends Component {

    public static Instance:TailPage = null;

    public totalNum:number = 30;
    private currentNum:number = 0;
    @property({type:Node})
    mask:Node = null;

    @property({type:Node})
    pp:Node = null;

    private ppPos:Vec3 = null;
    start() {
        TailPage.Instance = this;
        this.node.active = false;
        this.pp.active = false;
        this.ppPos = this.pp.getPosition();
    }
    onShowPage() {
        this.node.active = true;
    }

    public plusAdd() {

        this.currentNum += 1;
        let percent = this.currentNum / this.totalNum;
        percent = percent >= 1 ? 1 :percent;
        if(percent >= 1) {
            this.pp.active = false;
        }
        else if(percent <= 0 ) {
            this.pp.active = false;
        } else {
            this.pp.active = true;
        }
        let myWidth = percent * 550;
        this.pp.setPosition(new Vec3(this.ppPos.x + myWidth, this.ppPos.y, this.ppPos.z));

        this.mask.getComponent(UITransform).setContentSize(myWidth, 30);
    }

    clickDown() {
        GameControl.DownloadClick();
    }

    update(deltaTime: number) {
        
    }
}


