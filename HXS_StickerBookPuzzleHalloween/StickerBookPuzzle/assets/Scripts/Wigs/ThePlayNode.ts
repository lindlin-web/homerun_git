import { _decorator, Component, Material, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ThePlayNode')
export class ThePlayNode extends Component {

    @property(Material)
    materialNormal:Material = null;

    @property(Material)
    materialOutLine:Material = null;
    start() {
        this.node.getComponent(Sprite).setMaterial(this.materialOutLine, 0);

        this.scheduleOnce(()=>{
            this.node.getComponent(Sprite).setMaterial(this.materialNormal, 0);
        }, 1);
    }



    update(deltaTime: number) {
        
    }
}


