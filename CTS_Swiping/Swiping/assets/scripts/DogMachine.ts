import { _decorator, CCFloat, Component, Node,Animation, v3, tween } from 'cc';
import { AppNotify, NotifyMgrCls } from './controller/AppNotify';
import { RollContent } from './roll/RollContents';
import { AudioMgr } from './AudioMgr';
const { ccclass, property } = _decorator;

export enum WrapModeMask {
    Default = 0,
    Normal = 1 << 0,
    Loop = 1 << 1,
    ShouldWrap = 1 << 2,
    Clamp = 1 << 3,
    PingPong = 1 << 4 | 1 << 1 | 1 << 2,  // Loop, ShouldWrap
    Reverse = 1 << 5 | 1 << 2,      // ShouldWrap
}

const ITEMS = {
   "COIN": 1,
   "BAGCOIN":2,
   "CANON":3,
   "DOG":4,
   "ENERGY":5,
   "SHIELD":6,
   "BOX":7,
};

const ITEMSNAME = {
   "_1":"COIN",
   "_2":"BAGCOIN",
   "_3":"CANON",
   "_4": "DOG",
   "_5":"ENERGY",
   "_6":"SHIELD",
   "_7":"BOX",
};


const ITEMSSCALE = {
   "_1":0.9,
   "_2":0.9,
   "_3":1.3,
   "_4": 0.9,
   "_5":0.9,
   "_6":1.5,
   "_7":1.2,
   "_8":1.0,
   "_9":0.9,
};
const ITEMSARRAY = [1, 2, 3,4,5,6,7];
const TOTALITEM = 7;

@ccclass('DogMachine')
export class DogMachine extends Component {
   @property([Node])
   contentNodes:Node[] = [];                // 内容的节点是多少...

   @property(CCFloat)              
   rollingTime:number = 0;         // 滚动的时间是多少.

   /** 这个值是设置进去的 */
   private result:number[] = [];           // 要选定的结果是什么...这个长度，需要跟content长度一致.

   @property([CCFloat])
   preTime:number[] = [];                  // 每个content 的提前量是多少, 就是停顿多久的时间，才开始转动



   @property(Node)
   theClickTip:Node;

   private isRolling:boolean = false;      // 是否在滚动中..

   private finishedTime:number = 0;        // 三个框，结束了.

   private spinTime:number = 0;

   private isQualify:boolean = false;       // 是否符合要求...
   protected start(): void {
       this.isRolling = false;
       NotifyMgrCls.getInstance().observe(AppNotify.ANIMATIONDONE, this.onAnimationDone.bind(this));
       for(let i = 0; i < this.contentNodes.length; i++) {
           let content = this.contentNodes[i];
           let rollContent = content.getComponent(RollContent);
           rollContent.setRollingTime(this.rollingTime);
       }
   }

   doIndexEffect() {
      let finishedTime = this.finishedTime;
      let content = this.contentNodes[finishedTime - 1];
      let rollContent = content.getComponent(RollContent);
        let n1 = rollContent.findNodeByIndex(7);
        n1.getComponent(Animation).play("scaleUpOnce");

        n1 = rollContent.findNodeByIndex(8);
        n1.getComponent(Animation).play("scaleUpOnce");

        n1 = rollContent.findNodeByIndex(9);
        n1.getComponent(Animation).play("scaleUpOnce");
   }

   onAnimationDone() {
       this.finishedTime += 1;

       if(this.finishedTime == 1) {
        this.doIndexEffect();
       }
       if(this.finishedTime == 2) {
        this.doIndexEffect();
       }
       if(this.finishedTime == 3 && this.isRolling) {
           this.isRolling = false;
           this.finishedTime = 0;
           this.doTheEffect();
           this.scheduleOnce(()=>{
               NotifyMgrCls.getInstance().send(AppNotify.SPINDONE, this.spinTime);
               if(this.spinTime == 3) {
                   this.spinTime = 0;
               }
           }, 1.5);
       }
   }

   private doTheEffect() {
       for(let i = 0; i < this.contentNodes.length; i++) {
           let content = this.contentNodes[i];
           let rollContent = content.getComponent(RollContent);
           let n1 = rollContent.findNodeByIndex(7);
           n1.getComponent(Animation).play("scaleUp");
   
           n1 = rollContent.findNodeByIndex(8);
           n1.getComponent(Animation).play("scaleUp");
   
           n1 = rollContent.findNodeByIndex(9);
           n1.getComponent(Animation).play("scaleUp");
        //    node.getChildByName("dogThing").active = true;
        //    let nameOfNode = node.name;
        //    node.getChildByName(nameOfNode).getComponent(Animation).play();
       }
   }

   public setQualify(bo:boolean) {
        this.isQualify = bo;
   }

   private doSpin() {
        if(!this.isQualify) {
            return;
        }
       //AudioMgr.Instance.PlayBgm();
       if(this.isRolling) {
           return;
       }
       
       AudioMgr.Instance.butn.play();
       this.theClickTip.active = false;
       this.spinTime++;
       if(this.spinTime != 1) {
            return;
       }
       if(this.result && this.result.length == 3) {
           for(let i = 0; i < this.contentNodes.length; i++) {
               let content = this.contentNodes[i];
               let node = content.getComponent(RollContent).findNodeByIndex(this.result[i]);
               node.getChildByName("dogThing").active = false;
               let nameOfNode = node.name;
               let aniComp = node.getChildByName(nameOfNode).getComponent(Animation);
               if(aniComp) {
                   node.getChildByName(nameOfNode).getComponent(Animation).stop();
               }
           }
       }
       
       this.isRolling = true;
       this.result = this.createTheValue();
       for(let i = 0; i < this.contentNodes.length; i++) {
           let content = this.contentNodes[i];
           let rollContent = content.getComponent(RollContent);
           rollContent.setResult(this.result[i]);
           tween(content).delay(this.preTime[i]).call(()=>{
               AudioMgr.Instance.tigerTurn.play();
               rollContent.doingTheRollingThing();
           }).start();
       }
   }


   private createTheValue():number[] {
       let retValues = [];
       for(let i = 0; i < this.contentNodes.length; i++) {
           let content = this.contentNodes[i];
           let random = Math.floor(Math.random() * (TOTALITEM ));
           console.log(random);
           random = ITEMSARRAY[random];
           retValues.push(random);
           console.log(ITEMSNAME["_" + random],"===", random);
       }
       
       retValues = [1,1,1];
       return retValues;
   }
}