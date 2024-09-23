import { _decorator, Component, math, Node, UITransform } from 'cc';
import { GameControl } from './Framework/GameControl';
const { ccclass, property } = _decorator;

@ccclass('TailPage')
export class TailPage extends Component {

    public static Instance:TailPage = null;

    public totalNum:number = 150;
    private currentNum:number = 0;
    @property({type:Node})
    mask:Node = null;
    start() {
        TailPage.Instance = this;
        this.node.active = false;
    }
    onShowPage() {
        this.node.active = true;
    }

    public plusAdd() {
        this.currentNum += 1;
        let percent = this.currentNum / this.totalNum;
        percent = percent >= 1 ? 1 :percent;
        let myWidth = percent * 300;
        this.mask.getComponent(UITransform).setContentSize(myWidth, 30);
    }

    clickDown() {
        GameControl.DownloadClick();
    }

    update(deltaTime: number) {
        
    }
}


