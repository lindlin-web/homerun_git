import { _decorator, Component, Node } from 'cc';
import { SpecialLabel } from './SpecialLabel';
const { ccclass, property } = _decorator;

@ccclass('MoveingNode')
export class MoveingNode extends Component {
    @property(Node)
    theEffect:Node;

    @property(SpecialLabel)
    theSpecialLabel:SpecialLabel;
    start() {

    }

    update(deltaTime: number) {
        
    }

    OnFinished() {
        this.theEffect.active = true;
        this.node.active = false;
        this.theSpecialLabel.earn(5152228940 * 100);
    }
}


