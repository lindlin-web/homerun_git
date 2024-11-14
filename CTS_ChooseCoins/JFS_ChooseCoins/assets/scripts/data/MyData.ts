import { GameMain } from "../GameLogic/GameMain";

export class MyData{
    private turningTime:number = 0;

    public static instance:MyData;
    public getTurningTime() {
        return this.turningTime;
    }

    public static getInstance():MyData {
        if(MyData.instance == null) {
            return MyData.instance = new MyData();
        }
        else {
            return MyData.instance;
        }
    }

    /** 设置这个turning time */
    public setTurningTime(index:number) {
        this.turningTime = index;
    }

    public doDownloadClick() {
        GameMain.instance.clickDown();
    }
}


