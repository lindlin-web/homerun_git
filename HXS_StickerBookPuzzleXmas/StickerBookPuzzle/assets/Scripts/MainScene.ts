import { _decorator, Component,screen,Node} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MainScene')
export class MainScene extends Component {

    @property(Node)
    heightNode:Node;

    @property(Node)
    widthNode:Node;

    protected onLoad(): void {
        screen.on("window-resize", this.onWindowResize.bind(this), this);
        let size = screen.windowSize;
        this.onWindowResize(size.width, size.height);
    }

    onWindowResize(width:number, height:number) {
        // let dogWidth = width;
        // if(width > height) {
        //     this.widthNode.active = true;
        //     this.heightNode.active = false;
        // } else {
        //     this.widthNode.active = false;
        //     this.heightNode.active = true;
        // }
    }
}


