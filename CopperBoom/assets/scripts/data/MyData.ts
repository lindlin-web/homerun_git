import { AppNotify, NotifyMgrCls } from "../controller/AppNotify";

const TOTALENERGY:number = 50;
export class MyData{
    private myEnergy:number = 50;

    private perTimeCostEnergy:number = 10;          // 每次消耗掉的能量是多少呢.....

    private spinTime:number = 0;                    // 旋转的次数是多少此...
    public constructor() {

    }
    public set Energy(energy:number) {
        this.myEnergy = energy;
        NotifyMgrCls.getInstance().send(AppNotify.COINCHANGE);
    }

    public get Energy() {
        return this.myEnergy;
    }

    public get TotalEnergy() {
        return TOTALENERGY;
    }
    
    public get SpinTime() {
        return this.spinTime;
    }

    public isEnough() {
        return this.myEnergy >= this.perTimeCostEnergy;
    }

    public doSpin():boolean {
        if(this.myEnergy >= this.perTimeCostEnergy) {
            this.myEnergy -= this.perTimeCostEnergy;
            NotifyMgrCls.getInstance().send(AppNotify.COINCHANGE);
            this.spinTime++
            return true;
        }
        else {
            NotifyMgrCls.getInstance().send(AppNotify.COIN_INSUFFICIENCE);
            return false;
        }
    }


    public get PerTimeCostEnergy() {
        return this.perTimeCostEnergy;
    }

    public set PerTimeCostEnergy(energy:number) {
        this.perTimeCostEnergy = energy;
    }
}


