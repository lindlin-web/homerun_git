import { _decorator, CCBoolean, CCFloat, Component, Node, v3, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CoinThing')
export class CoinThing extends Component {
    private life:number = 0;

    private weight:number = 0.5;        // 假装重量是0.5这样...

    private initVector:Vec2 = null;     // 初始化的速度是多少..

    private initPosition:Vec3 = null;       // 初始化的位置是多少...

    private currentLife:number = 0;         // 存活了多长的时间...

    private currentPos:Vec3 = null;         // 当前的位置是多少...

    private rotateSpeed:number = 0.1;       // 转动的速度是多少...

    private scaleSpeed:number = 0.01;       // 放大的动作...

    private initRotationOfz:number = 0;     // 

    private reuseToken:boolean = false;     // 是否会被重复使用的呢...

    @property(CCFloat)
    private initSclae:number = 0;               //

    @property(CCBoolean)
    private hasAnim:boolean = false;            // 是否有动画需要播放呢...

    onLoad(): void {
        this.currentLife = 0;
        this.life = -1;
        this.initPosition = v3(0, 0, 0);
        this.currentPos = v3(0, 0, 0);
        this.weight = 0.5;
        this.initRotationOfz = 0;
    }

    public set RotateSpeed(num:number) {
        this.rotateSpeed = num;
    }

    public get RotateSpeed() {
        return this.rotateSpeed;
    }

    public set MyWeight(num:number) {
        this.weight = num;
    }

    public get MyWeight() {
        return this.weight;
    }

    public set Life(num:number) {
        this.life = num;
    }

    public get Life() {
        return this.life;
    }

    public set InitVector(vec:Vec2) {
        this.initVector = vec;
    }

    public get InitVector() {
        return this.initVector;
    }

    public get Weight() {
        return this.weight;
    }

    public set Weight(weight:number) {
        this.weight = weight;
    }

    public set InitPosition(v:Vec3) {
        this.initPosition = v3(v.x, v.y, 0);
    }

    public get InitPosition() {
        return this.initPosition;
    }

    public set CurrentPos(v:Vec3) {
        this.currentPos = v3(v.x, v.y, 0);
    }

    public get CurrentPos() {
        return this.currentPos;
    }

    public set CurrentLife(life:number) {
        this.currentLife = life;
    }

    public get CurrentLife() {
        return this.currentLife;
    }

    public get ScaleSpeed() {
        return this.scaleSpeed;
    }

    public set ScaleSpeed(scaleSpeed:number) {
        this.scaleSpeed = scaleSpeed;
    }

    public get HasAnim() {
        return this.hasAnim;
    }

    public set ReuseToken(bo:boolean) {
        this.reuseToken = bo;
    }

    public get ReuseToken() {
        return this.reuseToken;
    }

    public onUpdate(dt:number) {
        this.currentLife += dt;
        this.Life -= dt;
        let currentPosx = this.initVector.x * this.currentLife;
        let currentPosy = this.initVector.y * this.currentLife - (1/2) * 3209.8 * this.currentLife * this.currentLife;
        let finalPosx = this.initPosition.x + currentPosx;
        let finalPosy = this.initPosition.y + currentPosy;
        let finalZ = this.initRotationOfz + this.RotateSpeed * this.currentLife;
        let dog = this.initSclae + this.scaleSpeed * this.currentLife;
        let finalScale = v3(dog, dog,dog);
        this.node.setScale(finalScale);
        this.node.setPosition(v3(finalPosx, finalPosy, 0));
        this.node.setRotationFromEuler(v3(0,0,finalZ));
    }


}


