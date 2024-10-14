import { _decorator, Component, Node, v3, Vec2, Vec3,screen } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('OperateNode')
export class OperateNode extends Component {

    private fireNode:Node;
    private backNode:Node;

    private center:Vec3;

    private totalTime:number = 0.2;

    private startDoing:boolean = false;

    private radius1:number = 2.223;

    private radius:number = 2.223;
    private radius2:number = 2.223 * 1.5;

    private currentTime = 0.0;

    public backPosition1:Vec3 =  v3(2.223,0.1,20);

    public backPosition:Vec3 = v3(2.223,0.1,20);

    public backPosition2:Vec3 = v3(2.223 * 1.5, 0.1, 20);

    public firePosition:Vec3 =  v3(0, 0.1, 17.777);

    public firePosition2:Vec3 = v3(0, 0.1, 16.4);
    public firePosition1:Vec3 =  v3(0, 0.1, 17.777);

    private backTotal:number = Math.PI * 3 / 2;

    private fireTotal:number = Math.PI / 2;
    start() {
        console.log("============onstart===================");
        this.center = v3(0,0.1,20);
    }
    protected onLoad(): void {

    }

    public setWidthOrHeight(val:number) {
        console.log("=============onset width orheight");
        if(val == 1) {
            this.radius = this.radius1;
            this.backPosition = this.backPosition1;
            this.firePosition = this.firePosition1;
        } else {
            this.radius = this.radius2;
            this.backPosition = this.backPosition2;
            this.firePosition = this.firePosition2;
        }
        this.backNode.setPosition(this.backPosition);
        this.backNode.setScale(v3(1.0,1.0,1.0));

        this.fireNode.setPosition(this.firePosition);
        this.fireNode.setScale(v3(1.3, 1.3, 1.3));
    }

    public setFireNode(node:Node) {
        this.fireNode = node;
        this.fireNode.name = "FireBoy";
    }

    public setBackNode(node:Node) {
        this.backNode = node;
    }

    public doCircleThing() {
        this.startDoing = true;
    }

    update(deltaTime: number) {
        if(this.startDoing) {
            this.currentTime += deltaTime;
            if(this.currentTime >= this.totalTime) {
                this.backNode.setPosition(this.backPosition);
                this.backNode.setScale(v3(1.0,1.0,1.0));

                this.fireNode.setPosition(this.firePosition);
                this.fireNode.setScale(v3(1.3, 1.3, 1.3));
                this.startDoing = false;
                this.currentTime = 0;
            } else {
                let angle = Math.PI*3 / 2 - this.currentTime / this.totalTime * this.backTotal; 
                let posx = this.radius * Math.cos(angle);
                let posy = this.radius * Math.sin(angle);
                this.backNode.setPosition(v3(this.center.x + posx, this.center.y, this.center.z + posy));

                let gap = this.currentTime / this.totalTime * 0.3;
                this.backNode.setScale(v3(1.3 -gap,1.3-gap, 1.3-gap));

                angle  =  0 - this.currentTime / this.totalTime * this.fireTotal;
                posx = this.radius * Math.cos(angle);
                posy = this.radius * Math.sin(angle);
                this.fireNode.setPosition(v3(this.center.x + posx, this.center.y, this.center.z + posy));
                this.fireNode.setScale(v3(1.0+gap,1.0+gap, 1.0+gap));
            }
        }
    }
}


