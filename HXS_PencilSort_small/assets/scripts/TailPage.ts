import { _decorator, Component, math, Node, UITransform, Vec3,v3 } from 'cc';
import { GameMain } from './GameLogic/GameMain';
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

    @property({type:Node})
    pointer:Node = null;

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

    public plusAdd2(emptyNum:number, totalNum:number) {
        emptyNum = emptyNum - 5;
        emptyNum = Math.max(emptyNum, 0);
        let angle = -180 - emptyNum / totalNum    * 300;
        angle = Math.max(-360,angle);
        this.pointer.setRotationFromEuler(v3(0, 0, angle));
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
        GameMain.instance.clickDown();
    }

    update(deltaTime: number) {
        
    }
}


