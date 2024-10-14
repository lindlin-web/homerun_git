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
    pos : MyAudioCpt;

    @property(MyAudioCpt)
    delet : MyAudioCpt;

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


