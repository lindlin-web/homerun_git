import { _decorator, Component, Node } from 'cc';
import { MyAudioCpt } from './Framework/Audio/MyAudioCpt';
const { ccclass, property } = _decorator;

@ccclass('AudioMgr')
export class AudioMgr extends Component {
  static Instance : AudioMgr;
  @property(MyAudioCpt)
  BGM : MyAudioCpt;

  @property(MyAudioCpt)
  circleTurn : MyAudioCpt;

  @property(MyAudioCpt)
  coinDrop : MyAudioCpt;
  @property(MyAudioCpt)
  butn : MyAudioCpt;

  @property(MyAudioCpt)
  tigerTurn : MyAudioCpt;

  @property(MyAudioCpt)
  bigWin : MyAudioCpt;

  @property(MyAudioCpt)
  massive : MyAudioCpt;

  @property(MyAudioCpt)
  jackpot : MyAudioCpt;

  @property(MyAudioCpt)
  popUp : MyAudioCpt;

  @property(MyAudioCpt)
  circleReward : MyAudioCpt;

  @property(MyAudioCpt)
  jackpotgold : MyAudioCpt;

  @property(MyAudioCpt)
  turnStop : MyAudioCpt;

  bPlayBgm = false;

  bPlayCircleTurn = false;

  start() {
      AudioMgr.Instance = this;
  }

  update(deltaTime: number) {
      
  }

  PlayCircleTurn() {
       if(this.bPlayCircleTurn == false) {
           this.bPlayCircleTurn = true;
           this.circleTurn.play();
           this.circleTurn.setLoop(true);
       }
  }

  StopCircleTurn() {
       if(this.bPlayCircleTurn) {
           this.bPlayCircleTurn = false;
           this.circleTurn.stop();
       }
  }


  PlayBgm(){
      if(this.bPlayBgm == false)
      {
          console.log("PlayBgm");
          this.bPlayBgm = true;
          
          MyAudioCpt.mute = false;
          this.BGM.play();
          this.BGM.setLoop(true);

      } 
  }

}