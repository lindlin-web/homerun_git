import { _decorator, Component, Node, v2, v3, Vec2 } from 'cc';
import { Vector2D } from './Vector2D';
const { ccclass, property } = _decorator;

@ccclass('VehicleBehaveThing')
export class VehicleBehaveThing extends Component {
    
    protected _mass:number = 1.0;
    protected _maxSpeed:number = 4050;
    protected _position:Vector2D;
    protected _velocity:Vector2D;

    protected _initNodePosition:Vector2D;

    public constructor() {
        super();
        this._position = new Vector2D();
        this._velocity = new Vector2D();
    }

    public set mass(value:number) {
        this._mass = value;
    }

    public get mass():number {
        return this._mass;
    }

    public set maxSpeed(value:number) {
        this._maxSpeed = value;
    }

    public get maxSpeed():number {
        return this._maxSpeed;
    }

    public set position(value:Vector2D)
    {
        this._position = value.clone();
    }

    public get position():Vector2D {
        return new Vector2D(this._position.x, this._position.y);
    }

    public set velocity(value:Vector2D){
        this._velocity = value.clone();
    }

    public get velocity() :Vector2D {
        return this._velocity;
    }

    public onUpdate(dt:number):void {
        this._velocity.truncate(this._maxSpeed);
        this._velocity = this._velocity.multiply(0.99);
        this._position = this._position.add(this._velocity.multiply(dt));
        this.node.setPosition(v3(this._position.x,this._position.y, 0));
    }
}


