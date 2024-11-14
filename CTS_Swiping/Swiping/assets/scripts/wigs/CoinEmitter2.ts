import { _decorator, CCFloat, Component, instantiate, Node, Prefab, random, v2, v3 } from 'cc';
import { CoinThing } from './CoinThing';
const { ccclass, property } = _decorator;

let lastUsedParticle:number = 0;

@ccclass('CoinEmitter')
export class CoinEmitter extends Component {

  @property(Prefab)
  coinPrefab:Prefab;

  @property(CCFloat)
  amount:number;

  private particles:Node[] = [];           // 就是金币的节点的容器
  @property(CCFloat)
  private newParticles:number = 1;        // 每帧需要新出生多少个coin呢...

  private delayTime:number = 0.3;
  private currentTime:number = 0;
  start() {
      for(let i = 0; i < this.amount; i++) {
          let coin:Node = instantiate(this.coinPrefab);
          this.particles.push(coin);
          coin.active = false;
          this.node.addChild(coin);
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

  private resetParticle(particle:Node) {
      let randomx:number = Math.random() * 2600 - 1300;
      let randomy:number = Math.random() * 2400 -300;
      let randomRotate:number = Math.random() * 138 - 69;
      let comp:CoinThing = particle.getComponent(CoinThing);
      comp.InitScale = Math.random() / 3 + 0.7;
      comp.InitPosition = v3(0,0,0);
      comp.Life = 3.0;
      particle.active = true;    
      comp.InitVector = v2(randomx, randomy);
      comp.RotateSpeed= randomRotate;
      comp.CurrentLife = 0;
  }

  update(deltaTime: number) {
        this.currentTime += deltaTime;
        if(this.currentTime > this.delayTime) {
            /** 每帧产生一定量的particle */
            for(let i = 0; i < this.newParticles; i++) {
                let unusedParticle = this.firstUnusedParticle();
                this.resetParticle(this.particles[unusedParticle]);
            }

            // update all particles
            for(let i = 0; i < this.amount; i++) {
                let p = this.particles[i];
                let comp = p.getComponent(CoinThing);
                if(comp.Life > 0.0) {
                    comp.onUpdate2(deltaTime);
                }
                else {
                    comp.node.active = false;
                }
            }
        }
      
  }
}