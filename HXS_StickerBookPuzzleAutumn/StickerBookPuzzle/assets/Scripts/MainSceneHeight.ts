import { _decorator,Animation, Camera,screen, CameraComponent, Component, EventTouch, Input, input, instantiate, Label, Node, Prefab, Tween, tween, UITransform, v2, v3, Vec3, NodeEventType, Size, ScrollView, AnimationComponent } from 'cc';
import { ContainerWigs, POSITIONS } from './Wigs/ContainerWigs';
import { DragNode } from './Wigs/DragNode';
import { FixedNode } from './Wigs/FixedNode';
import { TheData } from './Data/TheData';
import { RotateSprite } from './Wigs/RotateSprite';
import { AppNotify, NotifyMgrCls } from './Controller/AppNotify';
import { GameControl } from './Framework/GameControl';
import { AudioMgr } from './AudioMgr';
const { ccclass, property } = _decorator;

const gapDistance = 10;          // 容错的距离是10个像素....

const TOTALTIME = 10;               //  成功的总的次数是多少。。。
const childrenName:string[] = [
    "6","36","41", "55", "74", "82", "94", "98", "111", "157", "158", "195", "199","206","217","220","236",
    "242","250","263","300","307","330","340","373","377","398","412","412-1","414","424","430","434","437",
    "484","485","485-1","485-2","522","572","573","574","580","663","705","731","736","740","750","753","754",
    "777","786","808","843","852","871","907","951","966"
];
@ccclass('MainScene')
export class MainSceneHeight extends Component {
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

    @property(Node)
    scroll:Node = null;

    /** 在检查确认是否可以匹对的那个节点 */
    private onCheckingFixedNode:Node = null;

    private tipTick:number = 0;

    private isTipOnAnimate:boolean = false;

    @property(Node)
    animationNode:Node = null;

    @property(Node)
    theBanner:Node = null;


    start() {
        this.scheduleOnce(()=>{
        }, 30);
        this.theTip.active = false;
        this.theTipHand.active = false;
        this.animationNode.active = false;
        NotifyMgrCls.getInstance().observe(AppNotify.CoverAnimationDone, this.onCoverAnimationDone.bind(this));
        NotifyMgrCls.getInstance().observe(AppNotify.SUCCESSFULTIMECHANGE, this.onSuccessfulTimeChange.bind(this));
        this.animationNode.getComponent(Animation).on(AnimationComponent.EventType.FINISHED, ()=>{
            this.animationNode.active = false;
        }, this);
        this.gameNode.on(NodeEventType.TRANSFORM_CHANGED, ()=>{
            this.setTipAnimate(false);
            if(AudioMgr.Instance) {
                AudioMgr.Instance.PlayBgm();
            }
        }, this);
        input.on(Input.EventType.TOUCH_START, this.onTouchHandle,this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);

        this.getFixedNodes();

        screen.on("window-resize", this.onWindowResize.bind(this), this);
        let size = screen.windowSize;
        this.onWindowResize(size.width, size.height);
    }


    togoPlay() {
        GameControl.DownloadClick();
    }

    onWindowResize(width:number, height:number) {
        let containerWidth:number = this.container.getComponent(UITransform).contentSize.width;
        let scale = height / (720);

        let totalWidth = containerWidth * scale;
        if(totalWidth > width) {
            let toScale = width / totalWidth;
            this.container.setScale(v3(toScale-0.01, toScale-0.01, 1));
        }
        else {
            this.container.setScale(v3(1, 1, 1));
        }

        let tipWidth:number = this.theTip.getComponent(UITransform).contentSize.width;
        let totalTipWidth = tipWidth * scale;
        if(totalTipWidth > width) {
            let toScale = width / totalTipWidth;
            this.theTip.parent.setScale(v3(toScale-0.03, toScale-0.03, 1));
            this.theBanner.setScale(v3(toScale-0.03, toScale-0.03, 1));
        } else {
            this.theTip.parent.setScale(v3(1, 1, 1));
        }
        if(height > width) {
            let myScale = 1/scale;
            let scrollwidth = this.scroll.getComponent(UITransform).contentSize.width;
            let scrollHeight = this.scroll.getComponent(UITransform).contentSize.height;
            let totalScrollWidth = scrollwidth * myScale;
            if(totalScrollWidth < width) {
                this.scroll.setScale(v3(1,1, 1));
                let myWidth = width / scale;


                this.gameNode.setScale(v3(0.75,0.75,0.75));
                let size = this.gameNode.getComponent(UITransform).contentSize;
                this.gameNode.getComponent(UITransform).setContentSize(size.width * 0.75, size.height * 0.75);

                this.scroll.getComponent(UITransform).setContentSize(myWidth, scrollHeight);
                this.scroll.getChildByName("view").getComponent(UITransform).setContentSize(myWidth, scrollHeight);

            } else {
                let toScale = width / totalWidth;
                
                this.scroll.setScale(v3(1/scale,1/scale, 1));

                this.gameNode.setScale(v3(0.75,0.75,0.75));
                let size = this.gameNode.getComponent(UITransform).contentSize;
                this.gameNode.getComponent(UITransform).setContentSize(720 * 0.75,1113 * 0.75);             // 这里应该写， original 的什么东西...
                //this.gameNode.setScale(v3(1/scale-0.3,1/scale-0.3, 1));
                let gap = scale - 1;
                gap *= 460;
                let height = 460 + gap;
                this.scroll.getComponent(UITransform).setContentSize(width, height);
                this.scroll.getChildByName("view").getComponent(UITransform).setContentSize(width, height);
            }
        }
        else {

            this.gameNode.setScale(v3(1,1,1));
                let size = this.gameNode.getComponent(UITransform).contentSize;
                this.gameNode.getComponent(UITransform).setContentSize(720,1113);
            this.scroll.setScale(v3(1,1, 1));
            this.theBanner.setScale(v3(1, 1, 1));
            this.scroll.getComponent(UITransform).setContentSize(720, 460);
            this.scroll.getChildByName("view").getComponent(UITransform).setContentSize(720, 460);
        }
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
                    fixedComp.setIndex(nameOfChild);
                }
            }
            else {
                console.log("name of child " + nameOfChild + " did not found,check if it is ok");
            }
        }
    }

    findFixedNodeByIndex(index:string):Node {
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

    doAnimationFromFixedNode(fixedNode:Node) {
        this.animationNode.active = true;
        let worldPos = fixedNode.getComponent(UITransform).convertToWorldSpaceAR(v3(0,0,0));
        let localPos = this.node.getComponent(UITransform).convertToNodeSpaceAR(worldPos);
        this.animationNode.setPosition(localPos);
        this.animationNode.getComponent(Animation).play();
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

                this.doAnimationFromFixedNode(fixedNode);
                AudioMgr.Instance.pile.play();
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
                
                this.theTip.getComponent(Animation).play();
                let target = this.findFixedNodeByIndex(this.container.getComponent(ContainerWigs).getFirstIndex());


                /** 把这个目标节点，尽可能的移动到正中心去 */
                this.gameNode.off(NodeEventType.TRANSFORM_CHANGED);
                this.makeTargetMoveToCenter(target);
                
            }
        }
    }

    /** 移动 fixedNode 尽可能到正中心 */
    makeTargetMoveToCenter(target:Node) {
        //  view 的中心点的坐标是多少..
        let viewNode = target.parent.parent;
        let contentHeight = viewNode.getComponent(UITransform).contentSize.height;
        let pos = v3(0, -contentHeight / 2, 0);
        let worldPos = viewNode.getComponent(UITransform).convertToWorldSpaceAR(pos);
        let localPos = this.gameNode.getComponent(UITransform).convertToNodeSpaceAR(worldPos);
        let gapx = target.getPosition().x;
        let gapy = target.getPosition().y;
        gapx += target.parent.getComponent(UITransform).contentSize.width / 2;
        gapy += target.parent.getComponent(UITransform).contentSize.height / 2;

        gapy = target.parent.getComponent(UITransform).contentSize.height/2 - gapy;

        gapx -= viewNode.getComponent(UITransform).contentSize.width/2;
        gapy -= contentHeight/2;


        let targetPosx = this.gameNode.getPosition().x + gapx;
        let targetPosy = this.gameNode.getPosition().y + gapy;


        this.scroll.getComponent(ScrollView).scrollToOffset(v2(gapx,gapy),0.6,true);


        Tween.stopAllByTarget(this.theTipHand);
        
        this.scheduleOnce(()=>{
            this.theTipHand.active = true;
            let dragNodeWorldPos = this.container.getChildByName("content").getComponent(UITransform).convertToWorldSpaceAR(POSITIONS[0]);
            let targetNodeWorldPos = target.parent.getComponent(UITransform).convertToWorldSpaceAR(target.getPosition());
            let fromPos = this.theTipHand.parent.getComponent(UITransform).convertToNodeSpaceAR(dragNodeWorldPos);
            let toPos = this.theTipHand.parent.getComponent(UITransform).convertToNodeSpaceAR(targetNodeWorldPos);
            this.theTipHand.setPosition(fromPos);
            tween(this.theTipHand).repeatForever(tween().delay(0.2).to(1.0, {position:toPos}).delay(0.2).call(()=>{
                this.theTipHand.setPosition(fromPos);
                this.gameNode.on(NodeEventType.TRANSFORM_CHANGED, ()=>{
                    this.setTipAnimate(false);
                    AudioMgr.Instance.PlayBgm();
                }, this);
            })).start();
        },0.8);
        

        //this.gameNode.setPosition(v3(targetPosx, targetPosy, 1.0));
    }

    checkIsQualify(dragNode:Node):boolean {
        let bo:boolean = false;
        let dragIndex = dragNode.getComponent(DragNode).getIndex();
        let fixedNode = this.findFixedNodeByIndex(dragIndex);

        let pos1:Vec3 = dragNode.getPosition();
        let pos2:Vec3 = fixedNode.getPosition();


        let theWidth = dragNode.getComponent(UITransform).contentSize.width;
        let theHeight = dragNode.getComponent(UITransform).contentSize.height;
        let scale = dragNode.getWorldScale();
        theWidth *= scale.x;
        theHeight *= scale.y;
        theHeight /= 2;
        pos1.y += theHeight;

        let worldPos = this.node.parent.getComponent(UITransform).convertToWorldSpaceAR(pos1);
        pos1 = fixedNode.parent.getComponent(UITransform).convertToNodeSpaceAR(worldPos);
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

    onCoverAnimationDone(myIndex:string) {
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
        this.node.addChild(temp);
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
        let localPos = this.node.getComponent(UITransform).convertToNodeSpaceAR(worldPos);
        let scale = TheData.getInstance().getScaleByIndex(myIndex);

        tween(temp).to(0.1, {position:localPos, scale:v3(scale, scale,scale)}).call(()=>{
            temp.removeFromParent();
            temp.destroy();
            temp = null;
            this.container.getComponent(ContainerWigs).showByIndex(myIndex);
        }).start();
    }

    onTouchMove(event:EventTouch) {
        AudioMgr.Instance.PlayBgm();
        this.tipTick = 0;
        this.setTipAnimate(false);
        let location = event.touch.getLocation();
        if(this.dragNode) {
            let world = this.camera.screenToWorld(v3(location.x, location.y, 0));
            let pos = this.node.getComponent(UITransform).convertToNodeSpaceAR(world);
            this.dragNode.setPosition(v3(pos.x,pos.y, 0));
        }
    }

    onTouchHandle(event:EventTouch) {
       AudioMgr.Instance.PlayBgm();
        let time = TheData.getInstance().getTime();
        if(time >= 10) {
            this.togoPlay();
            return;
        }
        this.tipTick = 0;
        this.setTipAnimate(false);
        let location = event.touch.getLocation();
        let hitNode = this.container.getComponent(ContainerWigs).hitTest(location);
        if(hitNode) {
            AudioMgr.Instance.pos.play();
            let temp:Node = this.dragNode = instantiate(hitNode.node);
            this.dragNode.getComponent(DragNode).setMyIndex(hitNode.getIndex());
            temp.getComponent(UITransform).setAnchorPoint(v2(0.5,0.0));
            let world = this.camera.screenToWorld(v3(location.x, location.y, 0));
            let pos = this.node.getComponent(UITransform).convertToNodeSpaceAR(world);
            temp.active = true;
            temp.setPosition(v3(pos.x,pos.y, 0));
            this.node.addChild(temp);

            let fixedNode = this.findFixedNodeByIndex(hitNode.getIndex());
            let worldScale:Vec3 = fixedNode.getWorldScale();
            tween(temp).to(0.1, {scale:v3(worldScale.x, worldScale.y, worldScale.z)}).start();
        }
    }

    update(deltaTime: number) {
        this.tipTick += deltaTime;
        if(this.tipTick > 4) {
            this.setTipAnimate(true);
        }

    }
}


