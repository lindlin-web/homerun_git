import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BaseCode')
export class BaseCode extends Component {
    @property({type:Node})
    base:Node = null;
    start() {
        this.base.active = false;
    }

    public setBaseActive(bo) {
        this.base.active = bo;
    }

    update(deltaTime: number) {
        
    }
}


