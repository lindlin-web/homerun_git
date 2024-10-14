import { _decorator, Component, math, Node, UITransform ,screen, Vec3} from 'cc';
import { GameControl } from './Framework/GameControl';
const { ccclass, property } = _decorator;

@ccclass('TailPage')
export class TailPage extends Component {

    public static Instance:TailPage = null;

    public totalNum:number = 50;
    private currentNum:number = 0;
    private widthForWidth:number = 700;
    private widthForHeight:number = 500;
    private isWidthOrHeight:boolean = true;
    @property({type:Node})
    mask:Node = null;

    @property({type:Node})
    maskWidth:Node = null;

    private pp1:Node = null;

    private pp2:Node = null;
    start() {
        TailPage.Instance = this;
        this.node.active = false;

        screen.on("window-resize", this.onWindowResize.bind(this), this);
        console.log(screen.windowSize);
        let size = screen.windowSize;
        this.onWindowResize(size.width, size.height);

        this.pp1 = this.mask.parent.getChildByName("pp");
        this.pp1.active = false;
        this.pp2 = this.maskWidth.parent.getChildByName("pp");
        this.pp2.active = false;
    }

    onWindowResize(width:number, height:number) {
        if(width > height) {
            // 宽匹配
            this.isWidthOrHeight = true;
            this.mask.parent.active = false;
            this.maskWidth.parent.active = true;
        } else {
            // 长度匹配
            this.isWidthOrHeight = false;
            this.mask.parent.active = true;
            this.maskWidth.parent.active = false;
        }
    }
    onShowPage() {
        this.node.active = true;
    }

    public plusAdd() {
        this.currentNum += 1;
        let percent = this.currentNum / this.totalNum;
        percent = percent >= 1 ? 1 :percent;
        if(percent >= 1) {
            this.pp1.active = false;
            this.pp2.active = false;
        }
        else if(percent <= 0) {
            this.pp1.active = false;
            this.pp2.active = false;
        } else {
            this.pp1.active = true;
            this.pp2.active = true;
        }
       
        let myWidthHeight = percent * this.widthForHeight;
        let myWidthWidth = percent * this.widthForWidth;
        this.pp1.setPosition(new Vec3(-245 +myWidthHeight, -8.706, 0));
        this.pp2.setPosition(new Vec3(-345 +myWidthWidth, -8.706, 0));
        this.mask.getComponent(UITransform).setContentSize(myWidthHeight, 30);
        this.maskWidth.getComponent(UITransform).setContentSize(myWidthWidth, 30);
    }

    clickDown() {
        console.log("click download version");
        GameControl.DownloadClick();
    }

    update(deltaTime: number) {
        
    }
}


