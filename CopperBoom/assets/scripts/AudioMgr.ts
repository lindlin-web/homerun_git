import { _decorator, Component, Node } from 'cc';
import { MyAudioCpt } from './Framework/Audio/MyAudioCpt';
const { ccclass, property } = _decorator;

@ccclass('AudioMgr')
export class AudioMgr extends Component {
   static Instance : AudioMgr;
   @property(MyAudioCpt)
   BGM : MyAudioCpt;

   @property(MyAudioCpt)
   pile : MyAudioCpt;

   @property(MyAudioCpt)
   butn : MyAudioCpt;

   @property(MyAudioCpt)
   pos : MyAudioCpt;

   @property(MyAudioCpt)
   delet : MyAudioCpt;

   @property(MyAudioCpt)
   gold_explode : MyAudioCpt;

   @property(MyAudioCpt)
   gold_explode_big:MyAudioCpt;

   @property(MyAudioCpt)
   box_open : MyAudioCpt;

   @property(MyAudioCpt)
   fire : MyAudioCpt;

   @property(MyAudioCpt)
   terror_smile : MyAudioCpt;

   @property(MyAudioCpt)
   energy : MyAudioCpt;

   @property(MyAudioCpt)
   meow : MyAudioCpt;


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