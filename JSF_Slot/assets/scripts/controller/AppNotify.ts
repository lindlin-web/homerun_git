// 这个是发送的事件...
export class AppNotify{
    public static ANIMATIONDONE:string = "ANIMATIONDONE"; // 发送，动作已经结束了...
    public static SPINDONE:string = "SPINDONE";             // spin 已经完毕了...
    public static CIRCLEDONE:string = "CIRCLEDONE";         // 圈圈已经，结束了 ...
    public static COINCHANGE:string = "COINCHANGE";       // 发送， 金币被改变了...
    public static COIN_INSUFFICIENCE:string = "COIN_INSUFFICIENCE";     // 能量不够了....
    public static ON_CONTINUE:string = "ON_CONTINUE";           // 继续的时候...
 
    public static ON_BOX_OPEND:string = "ON_BOX_OPEND";             // 宝箱 开启完毕了...
    public static ON_FIRE_CANNO_FINISHED:string = "ON_FIRE_CANNO_FINISHED";         // 当发射炮弹结束的时候...
 }
 
 
 
 export class NotifyMgrCls {
    public static instance:NotifyMgrCls = null;
    
    private subject:string[] = [];
    private subscribes:Function[][] = [];
    public static getInstance():NotifyMgrCls {
        if(NotifyMgrCls.instance == null) {
            NotifyMgrCls.instance = new NotifyMgrCls();
        }
        return NotifyMgrCls.instance;
    }
 
    public send(sub:string,args1=null,args2=null,args3=null, args4=null) {
        setTimeout(() => {
            let index = this.subject.indexOf(sub);
            let funcs:Function[] = this.subscribes[index];
            for(let i = 0; i < funcs.length; i++) {
                let fun = funcs[i];
                if(fun) {
                    fun(args1,args2,args3, args4);
                }
            }
        }, 1);
    }
 
    public observe(type:string, callback:Function) {
        let index = this.subject.indexOf(type);     // 看看是否有这个东西...
        if(index = -1) {
            this.subject.push(type);
            let funcs:Function[] = [];
            funcs.push(callback);
            this.subscribes.push(funcs);
        } else {
            let arr = this.subscribes[index];
            arr.push(callback);
        }
    }
 
    public off(type:string, callback) {
        let index = this.subject.indexOf(type);     // 看看是否有这个东西...
        if(index != -1) {
            let arr = this.subscribes[index];
            for(let i = arr.length - 1; i > 0; i--) {
                let fun = arr[i];
                if(fun.call == callback.call) {
                    arr.splice(i, 1);
                }
            }
        }
    }
 }