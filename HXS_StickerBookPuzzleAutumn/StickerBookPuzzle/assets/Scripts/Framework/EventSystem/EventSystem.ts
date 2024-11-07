
import { _decorator} from 'cc';
const { ccclass, property } = _decorator;

export class EventSystemPack
{
    thisPoint:any;
    handle : Function;  
    constructor(thisp : any, handle : Function)
    {
        this.thisPoint = thisp;
        this.handle = handle;
    } 
}

export class EventSystem  {

    private static ins = null

    public static Instance() : EventSystem
    {
        if(EventSystem.ins == null)
        {
            EventSystem.ins = new EventSystem();
        }
        return EventSystem.ins;
    } 

    private dicEv : {[key:number]:Array<EventSystemPack>} = {};


    has(key: any): boolean {
        return this.dicEv.hasOwnProperty(key);
    }

    RegistEvent(eventType : number, eventHandle : EventSystemPack)
    {
        if(!this.has(eventType))
        {
            this.dicEv[eventType] = new Array;
            this.dicEv[eventType].push(eventHandle);
        }
        else
        {
            if(this.dicEv[eventType].indexOf(eventHandle) == -1)
            {
                this.dicEv[eventType].push(eventHandle);
            }
            
        }
    }

    UnRegistEvent(eventType : number, eventHandle : EventSystemPack)
    {
        if (this.has(eventType)) {
            let id = this.dicEv[eventType].indexOf(eventHandle);
            if( id != -1)
            {
                this.dicEv[eventType].splice(id, 1); 
            }
        }
    }

    BroadCast(eventType : number, ...args)
    {
        if(this.has(eventType))
        {
            this.dicEv[eventType].forEach(element => {
                if(element.thisPoint == null)
                {
                    element.handle(...args);
                }
                else
                {
                    element.handle(element.thisPoint,...args);
                }
                
            });
        }
    }

 


}

