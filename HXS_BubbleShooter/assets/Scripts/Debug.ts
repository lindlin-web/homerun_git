import { DebugMode, game } from "cc";
import { DEBUG } from "cc/env";


/**
 * 日志管理类
 * 封装了console方法，可以通过DebugMode参数来控制显示的日志等级
 */
class Debug{
    static FUNC_MAP: Map<string, FuncInfo>;
    static initial(mode){
        let level = mode == undefined ?(DEBUG ? DebugMode.VERBOSE : DebugMode.INFO):mode
        game.config.debugMode = level

        for(const item of Debug.FUNC_MAP){
            let key = item[0]
            let info = item[1]
            let func = null
            if (info.level >= level && info.func && level != DebugMode.NONE) {
                func = info.func.bind(console, info.tag);
            }
            else {
                func = Debug.empty.bind(Debug);
            }

            //@ts-ignore
            Debug[key] = console[key] = func;
        }
        

    
    }

    static empty() {
    }

    static log(...args:any){

    }

    static info(...args:any){

    }

    static warn(...args:any){

    }
    
    static error(...args:any){

    }


    
}

class FuncInfo {
    public func:any
    public level: number;
    public tag:any
    constructor(func, level, tag) {
        this.func = func;
        this.level = level;
        this.tag = tag;
    }
}


Debug.FUNC_MAP = new Map([
    ["log", new FuncInfo(console.log, DebugMode.VERBOSE, `[LOG]`)],
    ["info", new FuncInfo(console.info, DebugMode.INFO, `[INFO]`)],
    ["warn", new FuncInfo(console.warn, DebugMode.WARN, `[WARN]`)],
    ["error", new FuncInfo(console.error, DebugMode.ERROR, `[ERROR]`)],
    ["assert", new FuncInfo(console.assert, DebugMode.VERBOSE, `[ASSERT]`)],
]);

export default Debug

