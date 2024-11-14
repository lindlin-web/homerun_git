import { _decorator, Component, Node } from 'cc';
import { MyAudioCpt } from './Framework/Audio/MyAudioCpt';
const { ccclass, property } = _decorator;

@ccclass('AudioMgr')
export class AudioMgr extends Component {
  static Instance : AudioMgr;
  @property(MyAudioCpt)
  BGM : MyAudioCpt;

  @property(MyAudioCpt)
  click : MyAudioCpt;

  @property(MyAudioCpt)
  explode_gold : MyAudioCpt;

  @property(MyAudioCpt)
  reverse_gold : MyAudioCpt;

  @property(MyAudioCpt)
  circle_zoom_in : MyAudioCpt;

  @property(MyAudioCpt)
  circle_stop : MyAudioCpt;

  @property(MyAudioCpt)
  xiu : MyAudioCpt;

  @property(MyAudioCpt)
  reward : MyAudioCpt;


  @property(MyAudioCpt)
  circle_go : MyAudioCpt;

  bPlayBgm = false;

  start() {
      AudioMgr.Instance = this;
  }

  update(deltaTime: number) {
      
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