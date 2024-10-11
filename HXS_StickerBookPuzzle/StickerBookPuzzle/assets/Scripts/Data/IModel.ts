
export interface IModel {

    setTime(val:number):void;   // 设置成功的次数        
    getTime():number;           // 获得成功的次数
    addTime():void;             // 成功添加一次
    
}