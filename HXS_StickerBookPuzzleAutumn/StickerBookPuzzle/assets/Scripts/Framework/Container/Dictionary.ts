 
/**
 * 高仿C#Dictionary
 * 效率稍差
 */
export default class Dictionary<K,V> extends Object {
 
    _keys: K[] = [];
    _values: V[] = [];
 
    public constructor(){
        super();
    }
 
    add:Function = function(key: K, value: V):void {
        if(this.containsKey(key)){
            this._values[this._keys.indexOf(key)] = value;
        }else{
            this._keys.push(key);
            this._values.push(value);
        }
    }
 
    remove:Function = function(key: K):void {
        var index = this._keys.indexOf(key, 0);
        this._keys.splice(index, 1);
        this._values.splice(index, 1);
    }
 
    get:Function = function(key:K):V{
        if(this.containsKey(key)){
            return this._values[this._keys.indexOf(key)];
        }else{
            return null;
        }
    }
 
    set:Function = function(key: K, value: V):void {
        if(this.containsKey(key)){
            this._values[this._keys.indexOf(key)] = value;
        }else{
            this._keys.push(key);
            this._values.push(value);
        }
    }
 
    keys:Function = function(): K[] {
        return this._keys;
    }
 
    values:Function = function(): V[] {
        return this._values;
    }
 
    containsKey:Function = function(key:K):boolean {
        return this._keys.indexOf(key) != -1;
    }
 
    containsValue:Function = function(value:V):boolean{
        return this._values.indexOf(value) != -1;
    }
 
    count:Function = function():number{
        return this._keys.length;
    }
 
    clear:Function = function():void{
        this._keys.splice(0);
        this._values.splice(0);
    }
 
    forEach:Function = function(callback:Function):void {
        this.foreach(callback);
    }
 
    foreach:Function = function(callback:Function):void {
        this._breaking = false;
        var sum = this._keys.length;
        for(var i=0;i<sum;i++){
            if(this._breaking){
                break;
            }
            callback(this._keys[i], this._values[i]);
        }
    }
 
    _breaking:boolean = false;
    break:Function = function():void {
        this._breaking = true;
    }
 
    toObject:Function = function():Object{
        var obj:Object = new Object();
        this.forEach((k,v) => {
            obj[k] = v;
        });
        return obj;
    }
}