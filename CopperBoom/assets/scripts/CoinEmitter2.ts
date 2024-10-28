import { _decorator, CCFloat, Component, instantiate, Node, Prefab, random, v2, v3,Animation } from 'cc';
import { CoinThing } from './wigs/CoinThing';
const { ccclass, property } = _decorator;

let lastUsedParticle:number = 0;

export let PERCOIN:number = 16;
export let PERBAG:number = 30;

@ccclass('CoinEmitter2')
export class CoinEmitter2 extends Component {

    @property(Prefab)
    coinPrefab:Prefab;

    @property(CCFloat)
    amount:number;

    private particles:Node[] = [];           // 就是金币的节点的容器

    @property(CCFloat)
    private newParticles:number = 1;        // 每帧需要新出生多少个coin呢...

    private startAnim:boolean = false;      // 是否开始播放动画呢..........

    start() {
        for(let i = 0; i < this.amount; i++) {
            let coin:Node = instantiate(this.coinPrefab);
            this.particles.push(coin);
            this.node.addChild(coin);
            coin.active = false;
        }

        this.startAnim = false;
    }

    /** 为了快速搜索到，上一个还未使用的节点 */
    public firstUnusedParticle():number {
        for(let i = lastUsedParticle; i < this.amount; i++) {
            let particle:Node = this.particles[i];
            let particleComp:CoinThing = particle.getComponent(CoinThing);
            if(particleComp.Life == 0.0) {
                lastUsedParticle = i;
                return i;
            }
        }
        // otherwise, do a linear search
        for(let i = 0; i < this.amount; i++) {
            let particle:Node = this.particles[i];
            let particleComp:CoinThing = particle.getComponent(CoinThing);
            if(particleComp.Life == 0.0) {
                lastUsedParticle = i;
                return i;
            }
        }
        return -1;
    }

    public setInitDataAndTotal(newSpawn:number, total:number) {
        if(total > this.amount) {
            total = this.amount;
        }
        if(newSpawn > this.amount) {
            newSpawn = this.amount;
        }

        this.newParticles = newSpawn;
        for(let i = 0; i < total; i++) {
            let p = this.particles[i];
            let comp = p.getComponent(CoinThing);
            comp.Life = 0;
        }
        this.startAnim = true;
    }

    public setInitData(newSpawn:number) {
        if(newSpawn > this.amount) {
            newSpawn = this.amount;
        }
        this.newParticles = newSpawn;
        for(let i = 0; i < this.newParticles; i++) {
            let p = this.particles[i];
            let comp = p.getComponent(CoinThing);
            comp.Life = 0;
        }
        this.startAnim = true;
    }

    private resetParticle(particle:Node) {
        let randomx:number = Math.random() * 900 - 450;
        let randomy:number = Math.random() * 1200 + 1000;
        let randomRotate:number = Math.random() * 138 - 69;
        particle.active = true;        
        let comp:CoinThing = particle.getComponent(CoinThing);

        let random:number = Math.floor(Math.random() * this.node.children.length);
        let pos = this.node.children[random].getPosition();
        comp.InitPosition = v3(0,0,0);
        comp.Life = 3.0;
        comp.InitVector = v2(randomx, randomy);
        comp.RotateSpeed= randomRotate;
        comp.ScaleSpeed = 0.1;
        comp.CurrentLife = 0;
        comp.ReuseToken = false;
        comp.node.setPosition(pos);
        if(comp.HasAnim) {
            comp.node.getChildByName("coin").getComponent(Animation).play();
        }
    }

    update(deltaTime: number) {
        if(!this.startAnim) {
            return;
        }
        let theNewArray = [];
        /** 每帧产生一定量的particle */
        for(let i = 0; i < this.newParticles; i++) {
            let unusedParticle = this.firstUnusedParticle();
            if(unusedParticle >= 0) {
                theNewArray.push(unusedParticle);
                let theNode = this.particles[unusedParticle];
                let coinThing = theNode.getComponent(CoinThing);
                if(!coinThing.ReuseToken && coinThing.Life == 0) {
                    this.resetParticle(theNode);
                }
            }
        }

        // update all particles
        for(let i = 0; i < this.amount; i++) {
            let p = this.particles[i];
            let comp = p.getComponent(CoinThing);
            if(comp.Life > 0.0) {
                this.startAnim = true;
                comp.onUpdate(deltaTime);
            }
        }
    }
}


