import { AppNotify, NotifyMgrCls } from "../Controller/AppNotify";
import { IModel } from "./IModel";
const TheMapReflect:object = {
    _1:{
        url:"images/1/texture",key:1,scale:0.75
    }, 
    
    _2:{
        url:"images/2/texture",key:1,scale:0.55
    }, 
    _3:{
        url:"images/3/texture",key:1,scale:0.75
    }, 

    _4:{
        url:"images/4/texture",key:1,scale:0.75
    }, 

    _5:{
        url:"images/5/texture",key:1,scale:0.75
    }, 

    _6:{
        url:"images/6/texture",key:1,scale:0.75
    }, 

    _7:{
        url:"images/7/texture",key:1,scale:0.75
    }, 

    _8:{
        url:"images/8/texture",key:1,scale:0.75
    }, 

    _9:{
        url:"images/9/texture",key:1,scale:0.55
    }, 

    _10:{
        url:"images/10/texture",key:1,scale:0.75
    }, 

    _11:{
        url:"images/11/texture",key:1,scale:0.65
    }, 

    _12:{
        url:"images/12/texture",key:1,scale:0.75
    }, 

    _13:{
        url:"images/13/texture",key:1,scale:0.25
    }, 

    _14:{
        url:"images/14/texture",key:1,scale:0.75
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


