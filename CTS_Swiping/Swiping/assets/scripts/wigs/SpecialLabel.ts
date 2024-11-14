import { _decorator, CCFloat, Component, Label, Node,Animation, Vec3, v3 } from 'cc';
const { ccclass, property } = _decorator;

const DURINGTIME = 4.8;           // 假设是两秒的时间...
@ccclass('SpecialLabel')
export class SpecialLabel extends Component {
  private currentValue:number = 5152228940;

  private targetValue:number = 1000;

  private str:string = "";

  private speed:number = 0;

  private isUpdating:boolean = false;

  private currentTime:number = 0;

  @property(Label)
  currentLabel:Label;

  private initLabelPos:Vec3 = v3(15.754,321.59,0);
  onLoad(): void {
      this.converNumToStr(this.currentValue);
  }

  public earn(value:number) {
      this.targetValue = this.currentValue + value;

      this.speed = Math.ceil(value / DURINGTIME);        // 速度

      this.isUpdating = true;
  }

  public get Speed() {
      return this.speed;
  }

  public set Speed(speed:number) {
      this.speed = speed;
  }

  protected update(dt: number): void {
      if(!this.isUpdating) {
          return;
      }
      this.currentTime += dt;
      let myValue = this.currentTime * this.speed + this.currentValue;
      myValue = Math.ceil(myValue);
      if(myValue > this.targetValue) {
          myValue = this.targetValue;
          this.isUpdating = false;
          this.currentValue = this.targetValue;
          this.currentTime = 0;
      }
      this.converNumToStr(myValue);
  }

  converNumToStr(val:number) {
      let hello =[];
      while(val / 10) {
          let value = val % 10;
          hello.push(value);
          val = Math.floor(val / 10);
      }
      let result = "";
      for(let i = hello.length - 1; i >= 0; i--) {
          let back = i != 0 && i % 3 == 0 ? ",": "";
          result = result +  hello[i]+ back;
      }
      this.currentLabel.string = result;
  }
}