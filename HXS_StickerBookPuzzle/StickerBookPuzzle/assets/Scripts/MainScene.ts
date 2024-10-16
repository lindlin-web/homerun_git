import { _decorator,Animation, Camera, CameraComponent, Component, EventTouch, Input, input, instantiate, Label, Node, Prefab, Tween, tween, UITransform, v2, v3, Vec3 } from 'cc';
import { ContainerWigs, POSITIONS } from './Wigs/ContainerWigs';
import { DragNode } from './Wigs/DragNode';
import { FixedNode } from './Wigs/FixedNode';
import { TheData } from './Data/TheData';
import { RotateSprite } from './Wigs/RotateSprite';
import { AppNotify, NotifyMgrCls } from './Controller/AppNotify';
const { ccclass, property } = _decorator;

const gapDistance = 10;          // 容错的距离是10个像素....

const TOTALTIME = 10;               //  成功的总的次数是多少。。。
const childrenName:string[] = [
    "one","two","three","four","five","six","seven", "eight", "nine","ten", "eleven", "twelve", "thirteen", "fourteen","fifteen", "sixteen", "seventeen", "eighteen","nineteen",
    "twenty","twenty_one","twenty_two", "twenty_three","twenty_four", "twenty_five", "twenty_six", "twenty_seven", "twenty_eight", "twenty_nine", "thrity",
    "thirty_one","thirty_two", "thirty_three", "thirty_four", "thirty_five", "thirty_six", "thirty_seven", "thirty_eight", "thirty_nine", "fourty", "fourty_one", "fourty_two",
    "fourty_three", "fourty_four", "fourty_five", "fourty_six", "fourty_seven", "fourty_eight", "fourty_nine", "fifty", "fifty_one", "fifty_two", "fifty_three", "fifty_five",
    "fifty_six", "fifty_seven", "fifty_nine", "sixty"
];
@ccclass('MainScene')
export class MainScene extends Component {
    @property(Node)
    theTip:Node = null;

    @property(Node)
    container:Node = null;

    fixedNodes:Node[] = [];

    private dragNode:Node = null;

    @property(CameraComponent)
    camera:CameraComponent = null;

    @property(Node)
    gameNode:Node = null;

    @property(Prefab)
    rotateSprite:Prefab;

    @property(Label)
    suessfulTime:Label = null;

    @property(Node)
    theTipHand:Node = null;

    /** 在检查确认是否可以匹对的那个节点 */
    private onCheckingFixedNode:Node = null;

    private tipTick:number = 0;

    private isTipOnAnimate:boolean = false;
    start() {

        this.theTip.active = false;
        this.theTipHand.active = false;
        NotifyMgrCls.getInstance().observe(AppNotify.CoverAnimationDone, this.onCoverAnimationDone.bind(this));
        NotifyMgrCls.getInstance().observe(AppNotify.SUCCESSFULTIMECHANGE, this.onSuccessfulTimeChange.bind(this));
        input.on(Input.EventType.TOUCH_START, this.onTouchHandle,this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);

        this.getFixedNodes();


    }

    onSuccessfulTimeChange() {
        let successfulTime = TheData.getInstance().getTime();
        this.suessfulTime.string = successfulTime + "/" + TOTALTIME;
    }

    /** 获得FixedNodes 所有的孩子节点 */
    getFixedNodes() {
        for(let i = 0; i < childrenName.length; i++) {
            let nameOfChild = childrenName[i];
            let child = this.gameNode.getChildByName(nameOfChild);
            if(child) {
                this.fixedNodes.push(child);
                let fixedComp = child.getComponent(FixedNode);
                if(!fixedComp) {
                    fixedComp = child.addComponent(FixedNode);
                    fixedComp.setIndex(i+1);
                }
            }
            else {
                console.log("name of child " + nameOfChild + " did not found,check if it is ok");
            }
        }
    }

    findFixedNodeByIndex(index:number):Node {
        let retNode:Node = null;
        for(let i = 0; i < this.fixedNodes.length; i++) {
            let fixedNode = this.fixedNodes[i];
            let fixedComp = fixedNode.getComponent(FixedNode);
            if(fixedComp.getIndex() == index) {
                retNode = fixedNode;
                break;
            }
        }
        return retNode;
    }


    onTouchEnd(event:EventTouch) {
        //this.fixedNode.getComponent(FixedNode).setFixed();
        this.tipTick = 0;
        this.setTipAnimate(false);


        if(this.dragNode) {
            
            let qualify = this.checkIsQualify(this.dragNode);
            if(qualify) {
                let dragIndex = this.dragNode.getComponent(DragNode).getIndex();
                let fixedNode = this.findFixedNodeByIndex(dragIndex);
                this.qualify(fixedNode);
            }
            else {
                this.unqualify();
            }
        }
    }

    setTipAnimate(bo:boolean) {
        if(!bo) {
            this.tipTick = 0;
            this.isTipOnAnimate = false;
            this.theTip.active = false;
            this.theTipHand.active = false;
        }
        else {
            if(this.isTipOnAnimate) {

            }
            else {
                this.isTipOnAnimate = true;
                this.theTip.active = true;
                this.theTipHand.active = true;
                this.theTip.getComponent(Animation).play();

                Tween.stopAllByTarget(this.theTipHand);
                let target = this.findFixedNodeByIndex(this.container.getComponent(ContainerWigs).getFirstIndex());
                let dragNodeWorldPos = this.container.getChildByName("content").getComponent(UITransform).convertToWorldSpaceAR(POSITIONS[0]);
                let targetNodeWorldPos = target.parent.getComponent(UITransform).convertToWorldSpaceAR(target.getPosition());

                let fromPos = this.theTipHand.parent.getComponent(UITransform).convertToNodeSpaceAR(dragNodeWorldPos);
                let toPos = this.theTipHand.parent.getComponent(UITransform).convertToNodeSpaceAR(targetNodeWorldPos);

                this.theTipHand.setPosition(fromPos);
                tween(this.theTipHand).repeatForever(tween().delay(0.2).to(1.0, {position:toPos}).delay(0.2).call(()=>{
                    this.theTipHand.setPosition(fromPos);
                })).start();
            }
        }
    }

    checkIsQualify(dragNode:Node):boolean {
        let bo:boolean = false;
        let dragIndex = dragNode.getComponent(DragNode).getIndex();
        let fixedNode = this.findFixedNodeByIndex(dragIndex);

        let pos1:Vec3 = dragNode.getPosition();
        let pos2:Vec3 = fixedNode.getPosition();


        let anchorPoint1 = fixedNode.getComponent(UITransform).anchorPoint;
        let anchorPoint2 = dragNode.getComponent(UITransform).anchorPoint;
        let anchorX = anchorPoint1.x - anchorPoint2.x;
        let anchorY = anchorPoint1.y - anchorPoint2.y;
        anchorX *= this.dragNode.getComponent(UITransform).contentSize.width;
        anchorY *= this.dragNode.getComponent(UITransform).contentSize.height;

        pos2.x -= anchorX;
        pos2.y -= anchorY;



        let gapx = Math.abs(pos1.x - pos2.x);
        let gapy = Math.abs(pos1.y - pos2.y);
        let distance = gapx * gapx + gapy * gapy;
        distance = Math.sqrt(distance);
        if(distance < gapDistance) {
            bo = true;
        }
        else {
            bo = false;
        }
        return bo;
    }

    onCoverAnimationDone(myIndex:number) {
        // 这个时候，需要去寻找那个 node 节点... 然后做出翻拍的动作出来...
        let fixedNode = this.findFixedNodeByIndex(myIndex);
        fixedNode.getComponent(FixedNode).setFixed();

        this.container.getComponent(ContainerWigs).doneWithNodeIndex(myIndex);
    }

    /** 如果是合格的话... */
    qualify(fixedNode:Node) {
        let myIndex = this.dragNode.getComponent(DragNode).getIndex();
        let rotateSprite = instantiate(this.rotateSprite);
        this.gameNode.addChild(rotateSprite);
        rotateSprite.setPosition(fixedNode.getPosition());
        rotateSprite.getComponent(RotateSprite).setIndex(myIndex);

        this.dragNode.removeFromParent();
        this.dragNode.destroy();
        this.dragNode = null;

        TheData.getInstance().addTime();
    }

    unqualify() {
        let temp = instantiate(this.dragNode);
        this.gameNode.addChild(temp);
        temp.getComponent(UITransform).setAnchorPoint(v2(0.5, 0.5));
        let anchorPoint = this.dragNode.getComponent(UITransform).anchorPoint;
        let gapx = 0.5 - anchorPoint.x;
        let gapy = 0.5 - anchorPoint.y;
        gapx *= this.dragNode.getComponent(UITransform).contentSize.width;
        gapy *= this.dragNode.getComponent(UITransform).contentSize.height;


        let originalPos = this.dragNode.getPosition();
        originalPos.x = originalPos.x + gapx;
        originalPos.y = originalPos.y + gapy;
        temp.setPosition(originalPos);


        let myIndex = this.dragNode.getComponent(DragNode).getIndex();
        this.dragNode.removeFromParent();
        this.dragNode.destroy();
        this.dragNode = null;

        let worldPos = this.container.getComponent(ContainerWigs).getWorldPos(myIndex);
        let localPos = this.gameNode.getComponent(UITransform).convertToNodeSpaceAR(worldPos);
        let scale = TheData.getInstance().getScaleByIndex(myIndex);

        tween(temp).to(0.1, {position:localPos, scale:v3(scale, scale,scale)}).call(()=>{
            temp.removeFromParent();
            temp.destroy();
            temp = null;
            this.container.getComponent(ContainerWigs).showByIndex(myIndex);
        }).start();
    }

    onTouchMove(event:EventTouch) {
        this.tipTick = 0;
        this.setTipAnimate(false);
        let location = event.touch.getLocation();
        if(this.dragNode) {
            let world = this.camera.screenToWorld(v3(location.x, location.y, 0));
            let pos = this.gameNode.getComponent(UITransform).convertToNodeSpaceAR(world);
            this.dragNode.setPosition(pos);
        }
    }

    onTouchHandle(event:EventTouch) {
        this.tipTick = 0;
        this.setTipAnimate(false);
        let location = event.touch.getLocation();
        let hitNode = this.container.getComponent(ContainerWigs).hitTest(location);
        if(hitNode) {
            let temp:Node = this.dragNode = instantiate(hitNode.node);

            this.dragNode.getComponent(DragNode).setMyIndex(hitNode.getIndex());
            temp.getComponent(UITransform).setAnchorPoint(v2(0.5,0.0));
            let world = this.camera.screenToWorld(v3(location.x, location.y, 0));
            let pos = this.gameNode.getComponent(UITransform).convertToNodeSpaceAR(world);
            temp.active = true;
            temp.setPosition(pos);
            this.gameNode.addChild(temp);
            tween(temp).to(0.1, {scale:v3(1.0,1.0,1.0)}).start();
        }
    }

    update(deltaTime: number) {
        this.tipTick += deltaTime;
        if(this.tipTick > 10) {
            this.setTipAnimate(true);
        }

    }
}


