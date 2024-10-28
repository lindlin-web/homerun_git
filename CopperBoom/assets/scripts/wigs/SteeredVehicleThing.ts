import { _decorator, Component, Node, Vec2 } from 'cc';
import { VehicleBehaveThing } from './VehicleBehaveThing';
import { Vector2D } from './Vector2D';
const { ccclass, property } = _decorator;

const BEHAVE = {
    "NONE":0,
    "SEEK":1,
    "WANDER":2,
}
@ccclass('SteeredVehicleThing')
export class SteeredVehicleThing extends VehicleBehaveThing {
    private _maxForce:number = 60;
    private _steeringForce:Vector2D;

    private _isUpdate:boolean = false;
    private behave:number = BEHAVE.NONE;
    private _seekTarget:Vector2D;



    private _wanderAngle:number = 0;
    private _wanderDistance:number = 0.3;
    private _wanderRadius:number = 0.2;
    private _wanderRange:number = 1;






    public constructor() {
        super();
        this._steeringForce = new Vector2D();
        this._seekTarget = new Vector2D();
    }

    public set maxForce(value:number) {
        this._maxForce = value;
    }

    public get maxForce():number {
        return this._maxForce;
    }

    public onUpdate(dt:number):void  {
        this._steeringForce.truncate(this._maxForce);
        this._steeringForce = this._steeringForce.divide(this._mass);
        this._velocity = this._velocity.add(this._steeringForce);
        this._steeringForce = new Vector2D();
        super.onUpdate(dt);
    }


    update(dt: number): void {
        
        if(this.behave == BEHAVE.SEEK) {
            this.seek(this._seekTarget);

            let currentPos = this._position;
            let gap = this._seekTarget.subtract(currentPos);
            let length = gap.length;
            if(length < 43.0) {
                this.node.removeFromParent();
                this.node.destroy();
            }
        }
        else if(this.behave == BEHAVE.WANDER) {
            this.wander();
        }
        this.onUpdate(dt);
    }

    public seek(target:Vector2D):void {
        this.behave = BEHAVE.SEEK;
        this._isUpdate = true;
        this._seekTarget = target;
        let desiredVelocity:Vector2D = target.subtract(this._position);
        desiredVelocity.normalize();
        desiredVelocity = desiredVelocity.multiply(this._maxSpeed);
        let force:Vector2D = desiredVelocity.subtract(this._velocity);
        this._steeringForce = this._steeringForce.add(force);
    }

    public wander():void {
        this.behave = BEHAVE.WANDER;
        this._isUpdate = true;
        let center:Vector2D = this.velocity.clone().normalize().multiply(this._wanderDistance);
        let offset:Vector2D = new Vector2D();
        offset.length = this._wanderRadius;
        offset.angle = this._wanderAngle;
        this._wanderAngle += Math.random() * this._wanderRange - this._wanderRange * 0.5;
        let force:Vector2D = center.add(offset);
        this._steeringForce = this._steeringForce.add(force);
    }
}


