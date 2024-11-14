import { _decorator, CCFloat, Component, Node, tween, UITransform, v2, v3, Vec2, Vec3 } from 'cc';
import { AppNotify, NotifyMgrCls } from '../controller/AppNotify';
import { AudioMgr } from '../AudioMgr';
const { ccclass, property } = _decorator;


const GAPS:Vec2[] = [v2(0, -110), v2(0,0), v2(0, 110)];
const ResultContentPos:Vec2 = v2(0, -47);
@ccclass('RollContent')
export class RollContent extends Component {
   
   @property([Node])
   subContents:Node[] = [];

   

   //@property(CCFloat)
   //targetVal:number = 0;           // 这个的意思是说，中心点在哪里

   @property(CCFloat)
   rollingSpeed:number = 0;        // 转动的速度是多少的呢....

   @property(CCFloat)
   bufferHeight:number = -400;            // 这个就是说，小于这个高度的时候，需要，移动到高的位置去...

   private rollingTime:number = 0;             // 需要转动多少的时间，才停顿下来的呢...



   private currentRollingTime:number = 0;          // 当前转动了多少的时间.....

   private isRolling:boolean = false;          // 是否是在rolling 的过程中.

   private resultPos:Vec3 = null;              // 结果的位置是在是一个世界坐标

   private resultContent:Node = null;          // result点，所属的父节点.......

   @property(CCFloat)
   stopBuffer:number = 100;            // 100 个像素，作为可以停止的，那个区间.

   @property(CCFloat)
   boundingBuffer:number = 50;         // 50 个像素，作为缓冲的区域...........


   private result:number = 0;              //  就是需要显示的结果的node，要记得，child node 里面的 name 前面的序列好，代表了item的index

   

   private isFinished:boolean = true;     // 是否已经结束了... 当前的转动，是否已经结束了...       默认是已经结束了...
   public setRollingTime(rollingTime:number) {
       this.rollingTime = rollingTime;
   }

   start(): void {
       // 开始转动的时候，需要设置停顿点在哪里... 
       // let targetNode = this.findNodeByIndex(this.targetVal);
       // if(!targetNode) {
       //     console.error("==========check name of target node if it is ok");
       //     return;
       // }

       //this.targetWorldPos = targetNode.getComponent(UITransform).convertToWorldSpaceAR(v3(0,0,0));
       
   }

   public setResult(val:number):void {
       this.result = val;
   }   

   /** 要记得，是result 需要在target这个地方被展示出来 */
   public setTargetWorldPosition(val:number):void {
       //this.targetVal = val;
   }

   /** 开始转动 */
   public doingTheRollingThing():void {
      
       if(this.rollingTime <= 0) {
           console.error("==========the rolling time is not setting=======");
           return;   
       }
       
       let resultNode:Node = this.findNodeByIndex(this.result);
       if(!resultNode) {
           console.error("==========check name of result node if it is ok");
           return;
       }

       this.setContentPositionByResult(resultNode);

       this.isRolling = true;
   }

   
   checkSubHeight() {
       for(let i = this.subContents.length - 1; i >= 0; i--) {
           let sub = this.subContents[i];
           let pos = sub.getPosition();
           if(pos.y < this.bufferHeight) {
               pos.y = this.subContents[0].getPosition().y + this.subContents[0].getComponent(UITransform).contentSize.height;
               let item = this.subContents.pop();
               sub.setPosition(pos);
               this.subContents.unshift(item);
               break;
           }
       }
   }


   update(dt: number): void {
       if(!this.isRolling) {
           return;
       }
       this.checkSubHeight();
       
       for(let i = 0; i < this.subContents.length; i++) {
           let sub = this.subContents[i];
           let pos = sub.getPosition();
           pos.y -= this.rollingSpeed;
           sub.setPosition(pos);
       }

       this.currentRollingTime += dt;

       let bo = this.checkIsTimeToStop();

       if(bo) {
           this.isRolling = false;

           this.doTheBoundTween();
       }

   }

   reset() {
       this.currentRollingTime = 0;
       this.isRolling = false;
   }

   private doTheBoundTween() {
       let currentPos = this.resultContent.getPosition();
       let finalPos1 = v3(this.resultPos.x + 0, this.resultPos.y - this.boundingBuffer, 0);
       let finalPos2 = this.resultPos;

       let gap1 = v3(finalPos1.x - currentPos.x, finalPos1.y - currentPos.y, 0);
       let gap2 = v3(finalPos2.x - currentPos.x, finalPos2.y - currentPos.y, 0);
       

       tween(this.resultContent).to(0.2, {position:finalPos1}).to(0.1, {position:finalPos2}).call(()=>{
           this.reset();
           AudioMgr.Instance.turnStop.play();
           NotifyMgrCls.getInstance().send(AppNotify.ANIMATIONDONE);
       }).start();

       for(let i = 0; i < this.subContents.length; i++) {
           let sub = this.subContents[i];
           if(sub != this.resultContent) {
               let subPos = sub.getPosition();
               let re1 = v3(subPos.x + gap1.x, subPos.y + gap1.y, 0);
               let re2 = v3(subPos.x + gap2.x, subPos.y + gap2.y, 0);
               tween(sub).to(0.2, {position:re1}).to(0.1, {position:re2}).start();
           }
       }
   }

   /** 确认是否是在缓冲之中 */
   private checkIsTimeToStop() {
       // 这里有几个条件，需要满足, 
       let resultBo:boolean = false;
       let currentY = this.resultContent.getPosition().y;
       let resultY = this.resultPos.y;
       let posOk = currentY > resultY;
       let stopBufferOk = (currentY - this.stopBuffer) > resultY;              // 看看是否是在buffer 区间之中
       let timeOk = this.currentRollingTime > this.rollingTime;                // 还需要看看，是否 滚动的时间，已经超过了 预设的 滚动事件
       if(posOk && stopBufferOk && timeOk) {
           resultBo = true;

           // 在这个时候. 需要把 resultConten夹在中间...

           let isInMiddle = false;
           let isInFirst = false;
           let isInLast = false;
           for(let i = 0; i < this.subContents.length; i++) {
               let sub = this.subContents[i];
               if(sub == this.resultContent && i == 1) {
                   isInMiddle = true;
                   break;
               }
               else if(sub == this.resultContent && i == 0) {
                   isInFirst = true;
                   break;
               }
               else if(sub == this.resultContent && i == 2) {
                   isInLast = true;
                   break;
               }
           }

           if(isInFirst) {
               let sub = this.subContents[2];
               let pos = sub.getPosition();
               pos.y = this.subContents[0].getPosition().y + this.subContents[0].getComponent(UITransform).contentSize.height;
               let item = this.subContents.pop();
               sub.setPosition(pos);
               this.subContents.unshift(item);
           }
           if(isInLast) {
               let sub = this.subContents[0];
               let pos = sub.getPosition();
               pos.y = this.subContents[2].getPosition().y - this.subContents[2].getComponent(UITransform).contentSize.height;
               let item = this.subContents.shift();
               sub.setPosition(pos);
               this.subContents.push(item);
           }
       }
       return resultBo;
   }

   /** 最终的content需要停留在什么地方 */
   private setContentPositionByResult(resultNode:Node):void {
       
       this.resultContent = resultNode.parent;

       let index = -1;
       for(let i = 0; i < this.resultContent.children.length; i++) {
           let child = this.resultContent.children[i];
           if(child == resultNode) {
               index = i;
               break;
           }
       }
       if(index == -1) {
           console.error("=========must be someting wrong=========");
       }
       let localPos = GAPS[index].clone();


       localPos.x = ResultContentPos.x + localPos.x;
       localPos.y = ResultContentPos.y + localPos.y;

       this.resultPos = v3(localPos.x, localPos.y, 0);
   }

   /** 根据index来查找节点 */
   public findNodeByIndex(val:number):Node {
       let retNode:Node = null;
       let hasFound:boolean = false;
       for(let i = 0; i < this.subContents.length; i++) {
           let sub = this.subContents[i];
           for(let j = 0; j < sub.children.length; j++) {
               let nameOfNode = sub.children[j].name;
               if(nameOfNode.indexOf(val + "_") >= 0) {           // 需要有一个下划线作为支撑...
                   retNode = sub.children[j];
                   hasFound = true;
                   break;
               }
           }
           if(hasFound) {
               break;
           }
       }
       return retNode;
   }


}