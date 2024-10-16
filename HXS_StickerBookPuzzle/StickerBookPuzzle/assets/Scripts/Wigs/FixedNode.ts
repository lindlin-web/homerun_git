import { _decorator, CCFloat, Component, Node, resources, Sprite, SpriteFrame, Texture2D } from 'cc';
import { TheData } from '../Data/TheData';
const { ccclass, property } = _decorator;

@ccclass('FixedNode')
export class FixedNode extends Component {
    
    private myIndex:number = 0;

    getIndex() {
        return this.myIndex;
    }

    setIndex(index:number) {
        this.myIndex = index;
    }
    start() {

    }

    setFixed() {
        let url = TheData.getInstance().getUrlByIndex(this.myIndex);
        resources.load(url,Texture2D,(err,data)=>{
            if(!err){
                let sp = new SpriteFrame();
                sp.texture = data!;
                this.node.getComponent(Sprite).spriteFrame = sp;
            }
        });
    }

    update(deltaTime: number) {
        
    }
}


