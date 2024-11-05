import { _decorator, Component, Node } from 'cc';
import super_html_playable from '../core/sdk/super_html_playable';
const { ccclass, property } = _decorator;

@ccclass('GameMain')
export class GameMain extends Component {

    public static instance:GameMain;
    start() {
        GameMain.instance = this;
        super_html_playable.game_ready();
    }


    gameFinish(){
        super_html_playable.game_end();
    }

    clickDown(){
        super_html_playable.download();
    }

    update(deltaTime: number) {
        
    }
}


