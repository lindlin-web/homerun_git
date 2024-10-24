import { _decorator, Component, Node } from 'cc';
import { CatEmitter } from './CatEmitter';
const { ccclass, property } = _decorator;

@ccclass('CatThing')
export class CatThing extends Component {
    @property(CatEmitter)
    ce:CatEmitter;

    @property(CatEmitter)
    ce2:CatEmitter;

    protected start(): void {
        this.schedule(()=>{
            this.ce.IsUpdate = true;
            this.ce2.IsUpdate = true;
        },0.9);

        this.schedule(()=>{
            this.node.removeFromParent();
            this.node = null;
        }, 4.6);
    }
}


