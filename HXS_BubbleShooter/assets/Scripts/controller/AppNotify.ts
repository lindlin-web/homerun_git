
// 这个是发送的事件...
export class AppNotify{
    public static INSERTBUBBLEDONE:string = "INSERTBUBBLEDONE"; // 插入一个bubble 球， 发送的事件...
    public static DELETEBUBBLEDONE:string = "DELETEBUBBLEDONE"; // 打出去的泡泡一组一样，需要删除掉...
    public static DROPBUBBLEDONE:string = "DROPBUBBLEDONE";     // 需要被掉落的泡泡，需要删除掉这些
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

