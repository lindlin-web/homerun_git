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
   
   start() {
       TailPage.Instance = this;
       this.node.active = false;

       screen.on("window-resize", this.onWindowResize.bind(this), this);
       console.log(screen.windowSize);
       let size = screen.windowSize;
       this.onWindowResize(size.width, size.height);

       
   }

   onWindowResize(width:number, height:number) {
       
   }
   onShowPage() {
       this.node.active = true;
   }

   public plusAdd() {
       
   }

   clickDown() {
       console.log("click download version");
       GameControl.DownloadClick();
   }

   update(deltaTime: number) {
       
   }
}