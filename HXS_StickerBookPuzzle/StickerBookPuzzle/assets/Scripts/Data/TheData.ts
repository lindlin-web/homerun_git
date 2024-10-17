import { AppNotify, NotifyMgrCls } from "../Controller/AppNotify";
import { IModel } from "./IModel";
const TheMapReflect:object = {
    _1:{
        url:"images/dance/texture",key:1,scale:0.55
    }, 
    _2:{
        url:"images/man/texture",key:1,scale:0.40
    },
    _3:{
        url:"images/picture1/texture",key:1,scale:0.75
    },
    _5:{
        url:"images/singer/texture",key:1,scale:0.55
    },
    _6:{
        url:"images/picture2/texture",key:1,scale:0.75
    },

    _7:{
        url:"images/sticker_274_gramp/texture",key:1,scale:0.50
    },

    _9:{
        url:"images/desk/texture",key:1,scale:0.65
    },

    _10:{
        url:"images/sofa_long/texture",key:1,scale:0.3
    },

    _11:{
        url:"images/hi90/texture",key:1,scale:0.75
    },
    _12:{
        url:"images/table/texture",key:1,scale:0.3
    },

    _13:{
        url:"images/sticker_9_Corgi_outline/texture",key:1,scale:0.75
    },

    _14:{
        url:"images/tamagochi/texture",key:1,scale:0.75
    },

    _15:{
        url:"images/grandpa/texture",key:1,scale:0.50
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
    
    getUrlByIndex(index:number) {
        let key = "_" +index;
        let result = TheMapReflect[key];
        return result.url;
    }

    getScaleByIndex(index:number):number {
        let key = "_" +index;
        let result = TheMapReflect[key];
        return result.scale;
    }
}


