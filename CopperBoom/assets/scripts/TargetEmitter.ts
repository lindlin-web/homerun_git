import { _decorator, Component, instantiate, Node, Prefab, tween, UIOpacity, Vec3,v3, UITransform } from 'cc';
import { SteeredVehicleThing } from './wigs/SteeredVehicleThing';
import { Vector2D } from './wigs/Vector2D';
const { ccclass, property } = _decorator;

export let EMITTERITEMS = {
    COIN: 1,
    SHILED:2,
    ENERGY:3
}
@ccclass('TargetEmitter')
export class TargetEmitter extends Component {
    
    @property(Prefab)
    coinPrefab:Prefab;

    @property(Prefab)
    shieldPrefab:Prefab;

    @property(Prefab)
    energyPrefab:Prefab

    private createScale:number = 1;             // 诞生的时候是多少的scale

    private finalScale:number = 0.1;            // 最终变成了多少的scale

    public doTheMoving(item:number, total:number, scale1:number, scale2:number, targetNode:Node,speed:number, gap = 0) {

            for(let i = 0; i < total; i++) {
                let node:Node = null;
                if(item == EMITTERITEMS.COIN) {
                    node = instantiate(this.coinPrefab);
                }
                else if(item == EMITTERITEMS.SHILED) {
                    node = instantiate(this.shieldPrefab);
                }
                else if(item == EMITTERITEMS.ENERGY) {
                    node = instantiate(this.energyPrefab);
                }
                let opa = node.getComponent(UIOpacity);
                opa.opacity = 0;
                node.setScale(v3(scale1, scale1, scale1));
                tween(opa).to(0.1, {opacity:255}).start();
                tween(node).delay(0.4).to(0.6, {scale:v3(scale2,scale2,scale2)}).start();
                let steered:SteeredVehicleThing = node.addComponent(SteeredVehicleThing);
                
                let index = Math.floor(Math.random() * 7);
                let pos = this.node.getChildByName("n" +index).getPosition();
                
                this.node.addChild(node);
                node.setPosition(pos);
                steered.velocity = new Vector2D(Math.random() * speed - speed/2, Math.random() * speed - speed/2);
                if(gap != 0) {
                    pos.x += Math.random() * gap - gap;
                    pos.y += Math.random() * gap - gap;
                }
                
                steered.position = new Vector2D(pos.x, pos.y);
                let world = targetNode.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0));
                let local = this.node.getComponent(UITransform).convertToNodeSpaceAR(world);
    
                tween(node).delay(0.6).call(()=>{
                    steered.seek(new Vector2D(local.x, local.y));
                }).start();
            }
            

    }
}


