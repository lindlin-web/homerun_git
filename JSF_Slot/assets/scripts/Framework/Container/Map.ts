 
export default class Map extends Object {
 
    public constructor(){
        super();
    }
 
    add:Function = function(key: string, value: Object):void {
        this[key] = value;
    }
 
    remove:Function = function(key: string):void {
        if(this.containsKey(key)){
            delete this[key];
        }
    }
 
    get:Function = function(key:string):Object{
        if(this.containsKey(key)){
            return this[key];
        }
        return null;
    }
 
    set:Function = function(key: string, value: Object):void {
        this[key] = value;
    }
 
    keys:Function = function(): string[] {
        var _keys:string[] = [];
        for (var key in this) {
			if (this.hasOwnProperty(key)) {
                _keys.push(key);
			}
        }
        return _keys;
    }
 
    values:Function = function(): Object[] {
        var _values:Object[] = [];
        for (var key in this) {
			if (this.hasOwnProperty(key)) {
                _values.push(this[key]);
			}
        }
        return _values;
    }
 
    containsKey:Function = function(key:string):boolean {
        return this.hasOwnProperty(key);
    }
 
    containsValue:Function = function(value:Object):boolean{
        for (var key in this) {
			if (this.hasOwnProperty(key)) {
                if (this[key] == value) {
                   return true;
                }
			}
        }
        return false;
    }
 
    count:Function = function():number{
        var num:number = 0;
        for (var key in this) {
			if (this.hasOwnProperty(key)) {
                num++;
			}
        }
        return num;
    }
 
    clear:Function = function():void{
        for (var key in this) {
			if (this.hasOwnProperty(key)) {
                delete this[key];
			}
        }
    }
 
    forEach:Function = function(callback:Function):void{
        this.foreach(callback);
    }
 
    foreach:Function = function(callback:Function):void{
        this._breaking = false;
        for (var key in this) {
            if(this._breaking){
                break;
            }
			if (this.hasOwnProperty(key)) {
                var type: string = typeof (this[key]);
                if(type != "function" && key != "_breaking"){
                    callback(key, this[key]);
                }
			}
        }
    }
 
    _breaking:boolean = false;
    break:Function = function():void {
        this._breaking = true;
    }
}