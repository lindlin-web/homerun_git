import { _decorator, Component, Node,Animation } from 'cc';
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

    public setTime(num:number) {
        this.node.active = true;
        this.bigWin.active = false;
        this.jackPot.active = false;
        this.massive.active = false;

        if(num == 1) {
            this.bigWin.active = true;
        }
        else if(num == 2) {
            this.massive.active = true;
        }
        else if(num == 3) {
            this.jackPot.active = true;
        }
        this.scheduleOnce(()=>{
            this.node.active =  false;
        }, 1.4);

        this.ghost1.getComponent(Animation).play();
        this.ghost2.getComponent(Animation).play();
    }
}


