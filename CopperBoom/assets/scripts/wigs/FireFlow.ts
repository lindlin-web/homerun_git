import { _decorator, Component, Node, Sprite, v4 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FireFlow')
export class FireFlow extends Component {
    @property(Node)
    node1:Node;

    @property(Node)
    node2:Node;

    @property(Node)
    node3:Node;

    @property(Node)
    node4:Node;

    private theOffset:number = 0.0;

    private theOffset2:number = 0.7;


    update(deltaTime: number) {
        this.theOffset += 0.04;            // 0--0.7,,,,   0.7 --- 0,  0.14---- (0)   15----

        this.theOffset2 += 0.04

        // let material = this.node4.getComponent(Sprite).getSharedMaterial(0);
        // material.setProperty("tilingOffset",v4(1,1,this.theOffset+4,0));

        // material = this.node3.getComponent(Sprite).getSharedMaterial(0);
        // material.setProperty("tilingOffset",v4(1,1,this.theOffset+3,0));

        let material = this.node2.getComponent(Sprite).getMaterialInstance(0);
        material.setProperty("tilingOffset",v4(1,1,0.7 - this.theOffset2 % 1.4,0));

        material = this.node1.getComponent(Sprite).getMaterialInstance(0);
        material.setProperty("tilingOffset",v4(1,1, 0.7 - this.theOffset % 1.4 ,0));


        
        material = this.node4.getComponent(Sprite).getMaterialInstance(0);
        material.setProperty("tilingOffset",v4(1,1,0.7 - this.theOffset2 % 1.4,0));

        material = this.node3.getComponent(Sprite).getMaterialInstance(0);
        material.setProperty("tilingOffset",v4(1,1,0.7 - this.theOffset % 1.4,0));


        if(this.theOffset >= 1000) {
            this.theOffset = 0.0;
            this.theOffset2 = 0.7;
        }
    }
}


