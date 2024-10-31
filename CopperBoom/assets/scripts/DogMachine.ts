import { _decorator, CCFloat, Color, color, Component, instantiate, Label, Node, Prefab, Sprite, tween, UIOpacity, UITransform, v2, v3, Vec2 ,screen,Animation, ProgressBar} from 'cc';
import { RollContent } from './roll/RollContent';
import { AppNotify, NotifyMgrCls } from './controller/AppNotify';
import { MyData } from './data/MyData';
import { CoinEmitter2, PERBAG, PERCOIN } from './CoinEmitter2';
import { SteeredVehicleThing } from './wigs/SteeredVehicleThing';
import { Vector2D } from './wigs/Vector2D';
import { SpecialLabel } from './wigs/SpecialLabel';
import { TargetEmitter } from './TargetEmitter';
import { AudioMgr } from './AudioMgr';
import { MyAudioCpt } from './Framework/Audio/MyAudioCpt';
const { ccclass, property } = _decorator;

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

    @property(Prefab)
    energyPref:Prefab = null;

    @property(Prefab)
    foodPref:Prefab = null;

    @property(Prefab)
    shieldPref:Prefab = null;

    @property(Prefab)
    coinPref:Prefab = null;

    @property(Node)
    createNodePos:Node = null;

    @property(Node)
    energyProgressNode:Node= null;


    @property(Prefab)
    TreasureBox:Prefab = null;

    @property(Prefab)
    CatPrefab:Prefab = null;

    @property(Node)
    bg:Node = null;


    private isRolling:boolean = false;      // 是否在滚动中..

    private currentRollingTime:number = 0;          // 当前已经转动了多久了...

    private finishedTime:number = 0;        // 三个框，结束了.

    private dataThing:MyData = new MyData();

    @property(Node)
    theDecorateNode:Node;               // 就是用来装饰的东西...

    @property(Node)
    finalPage:Node = null;

    @property(Label)
    private energyLab:Label;


    @property(CoinEmitter2)
    coinEmitter2:CoinEmitter2;

    @property(Node)
    man:Node;

    @property(Node)
    woman:Node;

    @property(SpecialLabel)
    mySpecialLabel:SpecialLabel;

    @property(Node)
    downLoad:Node;

    @property(Node)
    coin:Node;

    @property(Node)
    shieldThing:Node;

    @property(TargetEmitter)
    targetEmitter:TargetEmitter;

    private randomThreeTime:number[] = [];


    private fireTime:number = 0;


    @property(Node)
    fireNode:Node;


    onLoad() {
        NotifyMgrCls.getInstance().observe(AppNotify.ANIMATIONDONE, this.onAnimationDone.bind(this));
        NotifyMgrCls.getInstance().observe(AppNotify.COINCHANGE, this.onCoinChange.bind(this));
        NotifyMgrCls.getInstance().observe(AppNotify.COIN_INSUFFICIENCE, this.onCoinInsufficience.bind(this));
        NotifyMgrCls.getInstance().observe(AppNotify.ON_CONTINUE, this.onContinue.bind(this));
        NotifyMgrCls.getInstance().observe(AppNotify.ON_BOX_OPEND, this.onBoxOpened.bind(this));
        NotifyMgrCls.getInstance().observe(AppNotify.ON_FIRE_CANNO_FINISHED, this.onFireFinished.bind(this));
        this.finalPage.active = false;


        screen.on("window-resize", this.onWindowResize.bind(this), this);
        let size = screen.windowSize;
        this.onWindowResize(size.width, size.height);

        this.randomThreeTime.push(Math.floor(Math.random() * 10) + 1);
        this.randomThreeTime.push(Math.floor(Math.random() * 10) + 1);

    }

    onFireFinished() {
        //this.coinEmitter2.setInitDataAndTotal(6, 20);
        this.doTheDecorate(false);
        this.coinEmitter2.setInitData(40);
        this.mySpecialLabel.earn(40 * 1000);
        AudioMgr.Instance.gold_explode_big.play();
        this.fireTime ++;
        if(this.fireTime >= 3) {
            this.fireNode.active = false;
            this.fireTime = 0;
        }
    }
    

    onBoxOpened(index:number) {

        
        this.coinEmitter2.setInitDataAndTotal(6, 400);

        this.doTheDecorate();
        if(index == 1) {
            this.mySpecialLabel.earn(100 * 1000);
            AudioMgr.Instance.gold_explode_big.play();
        }
        else if(index == 2) {
            this.mySpecialLabel.earn(80 * 1000);
            AudioMgr.Instance.gold_explode_big.play();
        }
        else if(index == 3) {
            this.mySpecialLabel.earn(50 * 1000);
        }
    }

    onWindowResize(width:number, height:number) {
        if(width > height) {
            this.node.setScale(v3(1.4,1.4,1.4));
            this.node.setPosition(v3(2, -14, 0));
            this.man.setPosition(v3(-700.183, -493.67,0));
            this.man.setScale(v3(1.2, 1.2, 1));
            this.woman.setPosition(v3(649.958, -493.671,0));
            this.woman.setScale(v3(1.2, 1.2, 1));
            this.bg.setScale(v3(3, 3, 1));
            this.bg.setPosition(v3(0, 1581.629, 0));
            this.finalPage.setScale(v3(1.4,1.4,1));
            this.coin.setScale(v3(1.6,1.6,1));
            this.downLoad.setScale(v3(1.6,1.6,1));
            this.coin.setPosition(v3(-453.706,605.331,0));
            this.downLoad.setPosition(v3(453.706,605.331,0));
            this.shieldThing.setPosition(v3(-333.706,517.439,0));
        }
        else {
            this.node.setScale(v3(1.0,1.0,1.0));
            this.node.setPosition(v3(1.751, -163.144, 0));
            this.man.setPosition(v3(-93, 31,0));
            this.man.setScale(v3(0.6, 0.6, 1));
            this.woman.setPosition(v3(66.644, 61.245));
            this.woman.setScale(v3(0.6, 0.6, 1));

            this.bg.setScale(v3(1, 1, 1));
            this.bg.setPosition(v3(0, -30.129, 0));
            this.finalPage.setScale(v3(1,1,1));
            this.coin.setScale(v3(1,1,1));
            this.downLoad.setScale(v3(1,1,1));
            this.coin.setPosition(v3(-333.706,605.331,0));
            this.shieldThing.setPosition(v3(-223.706,517.439,0));
        }
    }


    private onContinue() {
        this.dataThing.Energy = 50;
    }

    private onCoinInsufficience() {
        this.finalPage.active = true;
    }
   
    private onCoinChange() {
        let myEnergy = this.dataThing.Energy;
        let totalEnergy = this.dataThing.TotalEnergy;
        this.energyLab.string = myEnergy + "/" + totalEnergy;
        this.energyProgressNode.getComponent(ProgressBar).progress = this.dataThing.Energy / 50;
    }

    private onAnimationDone() {
        this.finishedTime += 1;
        if(this.finishedTime == 3 && this.isRolling) {
            this.isRolling = false;
            this.finishedTime = 0;
            this.doTheEffect();

            this.scheduleOnce(()=>{
                let isenough = this.dataThing.isEnough();
                if(!isenough) {
                    this.onCoinInsufficience();
                }
            }, 3.5);
        }

        this.doTheShake();
    }

    /** ===开始那个特效=== */
    doTheEffect() {
        let howManyOfCoin:number = 0;
        let howManyOfBag:number = 0;

        for(let i = 0; i < this.result.length; i++) {
            let re = this.result[i];
            if(re == ITEMS.COIN) {
                howManyOfCoin ++;
            }
            if(re == ITEMS.BAGCOIN) {
                howManyOfBag ++;
            }
        }
        let totalSpawn = howManyOfCoin * PERCOIN + howManyOfBag * PERBAG;

        if(this.result[0] != this.result[1]  && this.result[1] != this.result[2]) {
            totalSpawn += PERCOIN;
        }

        if((this.result[0] == this.result[1]  && this.result[1] != this.result[2]) || (this.result[0] == this.result[2]  && this.result[1] != this.result[2])) {
            totalSpawn += PERCOIN +PERCOIN;
        }

        for(let i = 0; i < this.contentNodes.length; i++) {
            let content = this.contentNodes[i];
            let value = this.result[i];
            if(value == ITEMS.COIN || value == ITEMS.BAGCOIN || value == ITEMS.BOX) {
                let rollContent = content.getComponent(RollContent);
                let node = rollContent.findNodeByIndex(value);
                node.getChildByName("theFireFlow").active = true;
                let nameOfNode = node.name;
                node.getChildByName(nameOfNode).getComponent(Animation).play();
            }
            
        }

        /** 如果三个icon 都是一样的，那么就会有别的效果... */
        if(this.result[0] == this.result[1]  && this.result[1] == this.result[2]) {                  //this.result[0] == this.result[1]  && this.result[1] = this.result[2]


            for(let i = 0; i < this.contentNodes.length; i++) {
                let content = this.contentNodes[i];
                let rollContent = content.getComponent(RollContent);
                let node = rollContent.findNodeByIndex(this.result[0]);
                node.getChildByName("theFireFlow").active = true;
                let nameOfNode = node.name;
                node.getChildByName(nameOfNode).getComponent(Animation).play();
            }

            if(this.result[0] == ITEMS.ENERGY) {                  //this.result[0] == ITEMS.ENERGY
                // test 
                this.targetEmitter.doTheMoving(3,30,1,0.3,this.energyProgressNode,600);

                this.scheduleOnce(()=>{
                    AudioMgr.Instance.energy.play();
                },0.8);
                this.scheduleOnce(()=>{
                    this.dataThing.Energy += 30;
                },1);
            }
            else if(this.result[0] == ITEMS.COIN) {
                // test 
                this.targetEmitter.doTheMoving(1,100,1,1,this.coin.getChildByName("Label"),300);
                this.mySpecialLabel.earn(100 * 1000);
                AudioMgr.Instance.gold_explode_big.play();

                this.doTheDecorate();
            }
            else if(this.result[0] == ITEMS.BAGCOIN) {
                // test 
                this.targetEmitter.doTheMoving(1,300,1,1,this.coin.getChildByName("Label"),300);
                this.mySpecialLabel.earn(300 * 1000);
                AudioMgr.Instance.gold_explode_big.play();

                this.doTheDecorate();
            }
            else if(this.result[0] == ITEMS.SHIELD) {
                
                // test 
                this.targetEmitter.doTheMoving(2,10,1,0.3,this.shieldThing,400);
            }
            else if(this.result[0] == ITEMS.BOX) {
                let treature = instantiate(this.TreasureBox);
                this.node.parent.addChild(treature);
            }
            else if(this.result[0] == ITEMS.DOG) {
                let dog = instantiate(this.CatPrefab);
                dog.setPosition(v3(0, -30,0));
                this.node.addChild(dog);
                AudioMgr.Instance.meow.play();
                this.scheduleOnce(()=>{
                    this.mySpecialLabel.earn(600 * 1000);
                    AudioMgr.Instance.gold_explode_big.play();
                    this.doTheDecorate();
                },1);
            }
            else if(this.result[0] == ITEMS.CANON) {
                this.fireNode.active = true;
                this.fireNode.getComponent(Animation).play();

            }
        } else {
            this.coinEmitter2.setInitData(totalSpawn);

            this.mySpecialLabel.earn(totalSpawn * 1000);

            if(totalSpawn < 80)
            {
                AudioMgr.Instance.gold_explode.play();
            }
            else {
                AudioMgr.Instance.gold_explode_big.play();
            }
        }
    }

    doTheDecorate(playSmile=true) {

        if(playSmile !== false) {
            AudioMgr.Instance.terror_smile.play();
        }
        tween(this.theDecorateNode).repeat(7,tween(this.theDecorateNode).call(()=>{
            this.theDecorateNode.active = true;
        }).delay(0.15).call(()=>{
            this.theDecorateNode.active = false;
        }).delay(0.15)).call(()=>{
            this.theDecorateNode.active = false;
        }).start();
    }

    /** 开始做震动的动作 */
    doTheShake() {
        let tweenback = tween(this.node);
        let pos = this.node.getPosition();
        let tail = true;
        for(let i = 0; i < 3; i++) {
            let shakeOffset = v2(0,18 - i*3);
            
            if(tail) {
                tail = false;
                shakeOffset.y = -1 * shakeOffset.y;
            }
            tweenback = tweenback.call(()=>{
                let pos = this.node.getPosition();
                this.node.setPosition(v3(pos.x + shakeOffset.x, pos.y + shakeOffset.y, 0));
            }).delay(0.07);
            shakeOffset.x /= 2;
            shakeOffset.y /= 2;
        }
        tweenback.call(()=>{
            this.node.setPosition(pos);
        }).start();
    }

    protected start(): void {
        this.isRolling = false;
        for(let i = 0; i < this.contentNodes.length; i++) {
            let content = this.contentNodes[i];
            let rollContent = content.getComponent(RollContent);
            rollContent.setRollingTime(this.rollingTime);
        }
        this.onCoinChange();
    }


    private doSpin() {
        //AudioMgr.Instance.PlayBgm();
        MyAudioCpt.mute = false;
        AudioMgr.Instance.pos.play();
        if(this.isRolling) {
            return;
        }
        let spin = this.dataThing.doSpin();
        if(!spin) {
            return;
        }

        if(this.result && this.result.length == 3) {
            for(let i = 0; i < this.contentNodes.length; i++) {
                let content = this.contentNodes[i];
                let node = content.getComponent(RollContent).findNodeByIndex(this.result[i]);
                node.getChildByName("theFireFlow").active = false;
                let nameOfNode = node.name;
                let aniComp = node.getChildByName(nameOfNode).getComponent(Animation);
                if(aniComp) {
                    node.getChildByName(nameOfNode).getComponent(Animation).stop();
                }
                let scaleValue = ITEMSSCALE["_"+this.result[i]];
                node.getChildByName(nameOfNode).setScale(v3(scaleValue, scaleValue, scaleValue));
            }
        }
        
        this.energyProgressNode.getComponent(ProgressBar).progress = this.dataThing.Energy / 50;
        this.isRolling = true;
        this.result = this.createTheValue();
        for(let i = 0; i < this.contentNodes.length; i++) {
            let content = this.contentNodes[i];
            let rollContent = content.getComponent(RollContent);
            rollContent.setResult(this.result[i]);
            tween(content).delay(this.preTime[i]).call(()=>{
                rollContent.doingTheRollingThing();
            }).start();
        }

        this.scheduleOnce(()=>{
            AudioMgr.Instance.pile.play();
        },0.0);
        
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

        let spinTime = this.dataThing.SpinTime;

        if(Math.random() > 0.30 && spinTime % 5 != 0) {
            let theValue = Math.random();

            if(theValue > 0.7) {
                retValues = [ITEMS.ENERGY, ITEMS.ENERGY,ITEMS.ENERGY];
            }
            else if(theValue > 0.6) {
                retValues = [ITEMS.CANON, ITEMS.CANON,ITEMS.CANON];
            }
            else if(theValue > 0.5) {
                retValues = [ITEMS.BOX, ITEMS.BOX,ITEMS.BOX];
            }
            else if(theValue > 0.4) {
                retValues = [ITEMS.DOG, ITEMS.DOG,ITEMS.DOG];
            }
            else if(theValue > 0.3) {
                retValues = [ITEMS.COIN, ITEMS.COIN,ITEMS.COIN];
            }
            else if(theValue > 0.2) {
                retValues = [ITEMS.BAGCOIN, ITEMS.BAGCOIN,ITEMS.BAGCOIN];
            }
            else if(theValue > 0.1) {
                //retValues = [ITEMS.SHIELD, ITEMS.SHIELD,ITEMS.SHIELD];
            }
        }
        return retValues;
    }






}


