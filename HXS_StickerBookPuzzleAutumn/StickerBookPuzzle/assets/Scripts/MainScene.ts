import { _decorator, Component,screen,Node} from 'cc';
import { GameMain } from './GameLogic/GameMain';
const { ccclass, property } = _decorator;

@ccclass('MainScene')
export class MainScene extends Component {


    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_START, ()=>{
            GameMain.instance.clickDown();
        },this);
    }

    onWindowResize(width:number, height:number) {
        // let dogWidth = width;
        // if(width > height) {
        //     this.widthNode.active = true;
        //     this.heightNode.active = false;
        // } else {
        //     this.widthNode.active = false;
        //     this.heightNode.active = true;
        // }
    }
}


