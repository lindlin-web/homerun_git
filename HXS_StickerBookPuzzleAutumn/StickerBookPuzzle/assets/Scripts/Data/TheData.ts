import { AppNotify, NotifyMgrCls } from "../Controller/AppNotify";
import { IModel } from "./IModel";
const TheMapReflect:object = {
    _6:{
        url:"images/6/texture",key:1,scale:0.75
    }, 
    
    _36:{
        url:"images/36/texture",key:1,scale:0.75
    }, 
    _41:{
        url:"images/41/texture",key:1,scale:0.75
    }, 

    _55:{
        url:"images/55/texture",key:1,scale:0.75
    }, 

    _74:{
        url:"images/74/texture",key:1,scale:0.75
    }, 

    _82:{
        url:"images/82/texture",key:1,scale:0.75
    }, 

    _94:{
        url:"images/94/texture",key:1,scale:0.75
    }, 

    _98:{
        url:"images/98/texture",key:1,scale:0.75
    }, 

    _111:{
        url:"images/111/texture",key:1,scale:0.75
    }, 

    _157:{
        url:"images/157/texture",key:1,scale:0.75
    }, 

    _158:{
        url:"images/158/texture",key:1,scale:0.75
    }, 

    _195:{
        url:"images/195/texture",key:1,scale:0.75
    }, 

    _199:{
        url:"images/199/texture",key:1,scale:0.75
    }, 

    _206:{
        url:"images/206/texture",key:1,scale:0.75
    }, 
}

export class TheData implements IModel{
    public static instance:TheData;

    private successTime:number;
    constructor() {
        this.successTime = 0;
    }
    public static getInstance():TheData {
        if(TheData.instance == null) {
            TheData.instance = new TheData();
            return TheData.instance;
        } 
        else {
            return TheData.instance;
        }
    }
    setTime(val: number): void {
        this.successTime = val;
        NotifyMgrCls.getInstance().send(AppNotify.SUCCESSFULTIMECHANGE);
    }
    getTime(): number {
        return this.successTime;
    }
    addTime(): void {
        this.successTime += 1;
        NotifyMgrCls.getInstance().send(AppNotify.SUCCESSFULTIMECHANGE);
    }
    
    getUrlByIndex(index:string) {
        let key = "_" +index;
        let result = TheMapReflect[key];
        return result.url;
    }

    getScaleByIndex(index:string):number {
        let key = "_" +index;
        let result = TheMapReflect[key];
        return result.scale;
    }
}


