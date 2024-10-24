

export class Vector2D{
    private _x:number;
    private _y:number;
    
    public constructor(x:number = 0, y:number = 0) {
        this._x = x;
        this._y = y;
    }

    public clone():Vector2D {
        return new Vector2D(this.x, this.y);
    }

    public zero():Vector2D {
        this._x = 0;
        this._y = 0;
        return this;
    }

    public isZero():boolean {
        return this._x == 0 && this._y == 0;
    }

    public get lengthSQ():number {
        return this._x * this._x + this._y * this._y;
    }
    public set length(value:number) {
        let a:number = this.angle;
        this._x = Math.cos(a) * value;
        this._y = Math.sin(a) * value;
    }

    public get length():number {
        return Math.sqrt(this.lengthSQ);
    }
    public set angle(value:number) {
        let len:number = this.length;
        this._x = Math.cos(value) * len;
        this._y = Math.sin(value) * len;
    }

    public get angle():number {
        return Math.atan2(this._y, this._x);
    }

    public normalize():Vector2D {
        if(this.length == 0) {
            this._x = 1;
            return this;
        }
        let len:number = this.length;
        this._x /= len;
        this._y /= len;
        return this;
    }

    public truncate(max:number):Vector2D {
        this.length = Math.min(max, this.length);
        return this;
    }

    public reverse():Vector2D {
        this._x = -this._x;
        this._y = -this._y;
        return this;
    }

    public isNormalized():boolean {
        return this.length == 1.0;
    }

    public dotProd(v2:Vector2D):number {
        return this._x * v2._x + this._y * v2._y;
    }

    public static angleBetween(v1:Vector2D, v2:Vector2D):number {
        v1 = v1.clone().normalize();
        v2 = v2.clone().normalize();
        return Math.acos(v1.dotProd(v2));
    }

    public sign(v2:Vector2D):number {
        return this.perp.dotProd(v2) < 0 ? -1: 1;
    }

    public get perp():Vector2D {
        return new Vector2D(-this._y, );
    }

    public dist(v2:Vector2D):number {
        return Math.sqrt(this.distSQ(v2));
    }

    public distSQ(v2:Vector2D):number {
        let dx:number = v2.x - this.x;
        let dy:number = v2.y - this.y;
        return dx * dx + dy * dy;
    }

    public add(v2:Vector2D):Vector2D {
        return new Vector2D(this.x + v2.x, this._y + v2.y);
    }

    public subtract(v2:Vector2D):Vector2D {
        return new Vector2D(this._x - v2.x, this._y - v2.y);
    }

    public multiply(value:number):Vector2D {
        return new Vector2D(this._x * value, this._y * value);
    }

    public divide(value:number):Vector2D {
        return new Vector2D(this._x / value, this._y / value);
    }

    public set x(value:number) {
        this._x = value;
    }
    public get x():number {
        return this._x;
    }

    public set y(value:number) {
        this._y = value;
    }
    public get y():number {
        return this._y;
    }

    public equals(v2:Vector2D):boolean {
        return this._x == v2._x && this._y == v2._y;
    }
}


