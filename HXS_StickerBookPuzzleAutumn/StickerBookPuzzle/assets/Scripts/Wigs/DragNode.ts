import { _decorator, Component, Node, resources, Sprite, SpriteFrame, Texture2D, UITransform, v3 } from 'cc';
import { TheData } from '../Data/TheData';
const { ccclass, property } = _decorator;

@ccclass('DragNode')
export class DragNode extends Component {

    private myIndex:string;
    onLoad(){
        console.log("=onLoad=");
    }
    start() {
        // this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        // this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        // this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    getIndex() {
        return this.myIndex;
    }
    
    testIsHit(uiPoint):boolean {
        let bo = this.node.getComponent(UITransform).hitTest(uiPoint);
        return bo;
    }

    setMyIndex(index:string) {
        this.myIndex = index;
        let url = TheData.getInstance().getUrlByIndex(index);
        let scale = TheData.getInstance().getScaleByIndex(index);
        resources.load(url,Texture2D,(err,data)=>{
            if(!err){
                let sp = new SpriteFrame();
                sp.texture = data!;
                this.node.getComponent(Sprite).spriteFrame = sp;
                this.node.scale = v3(scale, scale, scale);
            }
        });


    }

    // onTouchStart(event) {
    //     this.isDraging = true;
        
    // }

    // onTouchMove(event) {
    //     if (this.isDraging) {
    //         let delta = event.getDelta();
            
    //         let pos = this.node.getPosition();
    //         pos.x += delta.x;
    //         pos.y += delta.y;
    //         this.node.setPosition(pos);
    //     }
    // }

    // onTouchEnd(event) {

    // }

    update(deltaTime: number) {
        
    }
}


