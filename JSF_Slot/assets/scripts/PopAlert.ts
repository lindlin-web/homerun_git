import { _decorator, Component, Node,Animation } from 'cc';
import { GameControl } from './Framework/GameControl';
import { AudioMgr } from './AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('PopAlert')
export class PopAlert extends Component {
    @property(Node)
    bigWin:Node
    @property(Node)
    jackPot:Node;

    @property(Node)
    massive:Node;

    @property(Node)
    ghost1:Node;

    @property(Node)
    ghost2:Node;

    protected onLoad(): void {
        this.bigWin.active = false;
        this.jackPot.active = false;
        this.massive.active = false;
        console.log("hello world");
    }

    protected onEnable(): void {
        AudioMgr.Instance.popUp.play();
    }

    public setTime(num:number) {
        this.node.active = true;
        this.bigWin.active = false;
        this.jackPot.active = false;
        this.massive.active = false;

        if(num == 1) {
            this.bigWin.active = true;
            AudioMgr.Instance.bigWin.play();
        }
        else if(num == 2) {
            this.massive.active = true;
            AudioMgr.Instance.massive.play();
        }
        else if(num == 3) {
            this.jackPot.active = true;
            AudioMgr.Instance.jackpot.play();
            this.scheduleOnce(()=>{
                AudioMgr.Instance.jackpotgold.play();
            },3);   
        }
        this.scheduleOnce(()=>{
            
            if(num == 3) {
                GameControl.DownloadClick();
            }
            else {
                this.node.active =  false;
            }
        }, 5.0);

        this.ghost1.getComponent(Animation).play();
        this.ghost2.getComponent(Animation).play();
    }
}


