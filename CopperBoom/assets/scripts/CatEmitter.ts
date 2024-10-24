import { _decorator, CCFloat, Component, computeRatioByType, instantiate, Node, Prefab, random, v2, v3 } from 'cc';
import { CoinThing } from './wigs/CoinThing';
const { ccclass, property } = _decorator;

let lastUsedParticle:number = 0;

@ccclass('CatEmitter')
export class CatEmitter extends Component {

    @property(Prefab)
    coinPrefab:Prefab;

    @property(CCFloat)
    amount:number;

    private particles:Node[] = [];           // 就是金币的节点的容器

    private isUpdate:boolean = false;       // 是否是在更新中的...
    @property(CCFloat)
    private newParticles:number = 1;        // 每帧需要新出生多少个coin呢...
    start() {
        for(let i = 0; i < this.amount; i++) {
            let coin:Node = instantiate(this.coinPrefab);
            this.particles.push(coin);
            this.node.addChild(coin);
            coin.active = false;
        }

    }

    /** 为了快速搜索到，上一个还未使用的节点 */
    public firstUnusedParticle():number {
        for(let i = lastUsedParticle; i < this.amount; i++) {
            let particle:Node = this.particles[i];
            let particleComp:CoinThing = particle.getComponent(CoinThing);
            if(particleComp.Life <= 0.0) {
                lastUsedParticle = i;
                return i;
            }
        }
        // otherwise, do a linear search
        for(let i = 0; i < lastUsedParticle; i++) {
            let particle:Node = this.particles[i];
            let particleComp:CoinThing = particle.getComponent(CoinThing);
            if(particleComp.Life <= 0.0) {
                lastUsedParticle = i;
                return i;
            }
        }
        lastUsedParticle = 0;
        return 0;
    }

    public set IsUpdate(bo:boolean) {
        this.isUpdate = bo;
    }

    private resetParticle(particle:Node) {
        let randomx:number = Math.random() * 500 - 300;
        let randomy:number = Math.random() * 700 + 300;
        let randomRotate:number = Math.random() * 138 - 69;
        let comp:CoinThing = particle.getComponent(CoinThing);
        comp.InitPosition = v3(0,0,0);
        comp.Life = 3.0;
        comp.InitVector = v2(randomx, randomy);
        comp.RotateSpeed= randomRotate;
        comp.CurrentLife = 0;
        particle.active = true;
    }

    update(deltaTime: number) {
        if(!this.isUpdate) {
            return;
        }
        /** 每帧产生一定量的particle */
        for(let i = 0; i < this.newParticles; i++) {
            let unusedParticle = this.firstUnusedParticle();
            let comp = this.particles[unusedParticle].getComponent(CoinThing);
            if(comp.Life == -1) {
                this.resetParticle(this.particles[unusedParticle]);
            }
        }

        // update all particles
        for(let i = 0; i < this.amount; i++) {
            let p = this.particles[i];
            let comp = p.getComponent(CoinThing);
            if(comp.Life > 0.0) {
                comp.onUpdate(deltaTime);
            }
        }
    }
}


