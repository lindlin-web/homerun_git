import { _decorator, Component, Node } from 'cc';
import { GameMain } from './GameLogic/GameMain';
const { ccclass, property } = _decorator;

@ccclass('ClickNode')
export class ClickNode extends Component {
    start() {
        this.node.on(Node.EventType.TOUCH_START, ()=>{
            GameMain.instance.clickDown();
        }, this);
    }

    update(deltaTime: number) {
        
    }
}


